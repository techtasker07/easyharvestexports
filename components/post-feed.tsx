"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { recordActivity } from "@/lib/activity";
import { RichContent } from "@/components/rich-content";
import { supabase, visitorId } from "@/lib/supabase";
import type { Comment, Post } from "@/lib/types";

type Counts = Record<string, { like: number; dislike: number; share: number }>;

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [counts, setCounts] = useState<Counts>({});
  const [drafts, setDrafts] = useState<Record<string, { name: string; body: string }>>({});
  const [openCommentForms, setOpenCommentForms] = useState<Record<string, boolean>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);

  useEffect(() => {
    load();
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel("public-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "post_reactions" }, load)
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, []);

  async function load() {
    setLoading(true);
    if (!supabase) {
      setNotice("Connect Supabase and run the schema to publish live posts.");
      setPosts([]);
      setLoading(false);
      return;
    }
    const { data: postRows, error: postError } = await supabase.from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
    if (postError) {
      setNotice(postError.message);
      setPosts([]);
      setLoading(false);
      return;
    }
    const livePosts = (postRows || []) as Post[];
    setPosts(livePosts);
    if (!livePosts.length) {
      setComments({});
      setCounts({});
      setLoading(false);
      return;
    }
    const postIds = livePosts.map((post) => post.id);
    const [{ data: commentRows }, { data: reactionRows }] = await Promise.all([
      supabase.from("comments").select("*").in("post_id", postIds).order("created_at", { ascending: true }),
      supabase.from("post_reactions").select("post_id,reaction").in("post_id", postIds)
    ]);
    setComments(groupByPost((commentRows || []) as Comment[]));
    const next: Counts = {};
    (reactionRows || []).forEach((row: { post_id: string; reaction: "like" | "dislike" | "share" }) => {
      next[row.post_id] ||= { like: 0, dislike: 0, share: 0 };
      next[row.post_id][row.reaction] += 1;
    });
    setCounts(next);
    setNotice("");
    setLoading(false);
  }

  const visiblePosts = useMemo(() => posts.filter(Boolean), [posts]);

  async function react(postId: string, reaction: "like" | "dislike" | "share") {
    setCounts((prev) => ({
      ...prev,
      [postId]: bumpReaction(prev[postId], reaction)
    }));
    if (reaction === "share" && navigator.share) {
      await navigator.share({ title: "EasyHarvest Exports", url: `${location.origin}/#post-${postId}` }).catch(() => undefined);
    }
    if (supabase) {
      const { error } = await supabase.from("post_reactions").insert({ post_id: postId, reaction, visitor_id: visitorId() });
      if (error) setNotice(error.message);
    }
    void recordActivity("post_reaction", reaction, { post_id: postId });
  }

  async function addComment(postId: string) {
    const draft = drafts[postId];
    if (!draft?.name || !draft?.body) return;
    const optimistic: Comment = {
      id: crypto.randomUUID(),
      post_id: postId,
      author_name: draft.name,
      body: draft.body,
      created_at: new Date().toISOString()
    };
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), optimistic] }));
    setDrafts((prev) => ({ ...prev, [postId]: { name: draft.name, body: "" } }));
    if (supabase) {
      const { error } = await supabase.from("comments").insert({ post_id: postId, author_name: draft.name, body: draft.body, visitor_id: visitorId() });
      if (error) setNotice(error.message);
    }
    void recordActivity("post_comment", "Submitted a post comment", { post_id: postId });
  }

  if (loading) {
    return <div className="feed-layout"><div className="grid"><div className="card post-card skeleton tall" /><div className="card post-card skeleton tall" /></div><aside className="card form-panel skeleton" /></div>;
  }

  if (!visiblePosts.length) {
    return <div className="empty-state">{notice || "No published posts yet. Add the first post from the admin console."}</div>;
  }

  return (
    <div className="feed-layout feed-layout-premium">
      <div className="grid">
        {visiblePosts.map((post) => {
          const postCounts = counts[post.id] || { like: 0, dislike: 0, share: 0 };
          const postDraft = drafts[post.id] || { name: "", body: "" };
          const isExpanded = Boolean(expandedPosts[post.id]);
          return (
            <article className="card post-card" id={`post-${post.id}`} key={post.id}>
              {post.image_url ? <div className="post-media"><img src={post.image_url} alt={post.title} /></div> : null}
              <div className="body">
                <div className="post-meta"><span>Market post</span><span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Live update"}</span></div>
                <h3>{post.title}</h3>
                {post.subtitle ? <h2 className="post-subtitle">{post.subtitle}</h2> : null}
                <RichContent className={`post-rich-content ${isExpanded ? "expanded" : "collapsed"}`} value={post.body} />
                <button
                  aria-expanded={isExpanded}
                  className="post-read-more"
                  onClick={() => setExpandedPosts((current) => ({ ...current, [post.id]: !isExpanded }))}
                  type="button"
                >
                  {isExpanded ? "Read less" : "Read more"}
                </button>
                {post.cta_label && post.cta_url ? <Link className="btn small gold post-cta" href={post.cta_url}>{post.cta_label}</Link> : null}
                <div className="post-actions">
                  <button className="action-btn reaction" onClick={() => react(post.id, "like")} aria-label="Like post">
                    <ReactionIcon name="like" />
                    <span className="reaction-label">Like</span>
                    <strong>{postCounts.like}</strong>
                  </button>
                  <button className="action-btn reaction" onClick={() => react(post.id, "dislike")} aria-label="Dislike post">
                    <ReactionIcon name="dislike" />
                    <span className="reaction-label">Dislike</span>
                    <strong>{postCounts.dislike}</strong>
                  </button>
                  <button className="action-btn reaction" onClick={() => react(post.id, "share")} aria-label="Share post">
                    <ReactionIcon name="share" />
                    <span className="reaction-label">Share</span>
                    <strong>{postCounts.share}</strong>
                  </button>
                  <button
                    className={`action-btn reaction ${openCommentForms[post.id] ? "active" : ""}`}
                    onClick={() => setOpenCommentForms((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    aria-label="Comment on post"
                  >
                    <ReactionIcon name="comment" />
                    <span className="reaction-label">Comment</span>
                    <strong>{(comments[post.id] || []).length}</strong>
                  </button>
                </div>
                <div className="comments">
                  <div className="comment-head">Comments {(comments[post.id] || []).length}</div>
                  {(comments[post.id] || []).slice(0, 3).map((comment) => <CommentView comment={comment} key={comment.id} />)}
                  {(comments[post.id] || []).length > 3 ? (
                    <button className="action-btn" onClick={() => setCommentModalPost(post)}>View all comments</button>
                  ) : null}
                  {openCommentForms[post.id] ? (
                    <div className="comment-compose">
                      <div className="grid two">
                        <input className="input" placeholder="Your name" value={postDraft.name} onChange={(event) => setDrafts((prev) => ({ ...prev, [post.id]: { ...postDraft, name: event.target.value } }))} />
                        <input className="input" placeholder="Write a comment" value={postDraft.body} onChange={(event) => setDrafts((prev) => ({ ...prev, [post.id]: { ...postDraft, body: event.target.value } }))} />
                      </div>
                      <button className="btn small secondary" onClick={() => addComment(post.id)}>Submit Comment</button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <aside className="card form-panel">
        <span className="eyebrow">Live buyer desk</span>
        <h3>Buyer follow-up</h3>
        <p>Submit a quote request, receive a tracking code, and continue the conversation from the tracking page.</p>
        <Link className="btn" href="/contact">Start Quote</Link>
        {notice ? <div className="notice">{notice}</div> : null}
      </aside>
      {commentModalPost ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${commentModalPost.title} comments`}>
          <div className="card comments-modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">All comments</span>
                <h3>{commentModalPost.title}</h3>
              </div>
              <button className="action-btn" onClick={() => setCommentModalPost(null)}>Close</button>
            </div>
            <div className="comments modal-comments">
              {(comments[commentModalPost.id] || []).map((comment) => <CommentView comment={comment} key={comment.id} />)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CommentView({ comment }: { comment: Comment }) {
  return (
    <div className="comment">
      <strong>{comment.author_name}</strong>
      <p>{comment.body}</p>
      {comment.admin_reply ? (
        <div className="admin-reply">
          <strong>EasyHarvest Team</strong>
          <p>{comment.admin_reply}</p>
        </div>
      ) : null}
    </div>
  );
}

function ReactionIcon({ name }: { name: "like" | "dislike" | "share" | "comment" }) {
  if (name === "share") {
    return (
      <svg className="reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 12.5 15.5 8.5" />
        <path d="M8.5 12.5 15.5 16.5" />
        <circle cx="6" cy="13.8" r="2.6" />
        <circle cx="18" cy="7" r="2.6" />
        <circle cx="18" cy="17" r="2.6" />
      </svg>
    );
  }
  if (name === "comment") {
    return (
      <svg className="reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.8A4 4 0 0 1 9 3h6a4 4 0 0 1 4 4v4.2a4 4 0 0 1-4 4H10l-4.5 4v-4.6A4 4 0 0 1 5 11.2Z" />
        <path d="M9 8h6" />
        <path d="M9 11.5h4" />
      </svg>
    );
  }
  return (
    <svg className="reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g transform={name === "dislike" ? "rotate(180 12 12)" : undefined}>
        <path d="M7.5 10.5v8" />
        <path d="M4.5 10.5h3v8h-3a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 4.5 10.5Z" />
        <path d="M7.5 11.2 11 4.5a2 2 0 0 1 3.7 1.2l-.4 3.3h3.2a2.4 2.4 0 0 1 2.3 3l-1.4 5a3.1 3.1 0 0 1-3 2.3H7.5" />
      </g>
    </svg>
  );
}

function bumpReaction(current: Counts[string] | undefined, reaction: "like" | "dislike" | "share") {
  const next = { like: 0, dislike: 0, share: 0, ...current };
  next[reaction] += 1;
  return next;
}

function groupByPost(rows: Comment[]) {
  return rows.reduce<Record<string, Comment[]>>((acc, row) => {
    acc[row.post_id] ||= [];
    acc[row.post_id].push(row);
    return acc;
  }, {});
}
