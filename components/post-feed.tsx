"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase, visitorId } from "@/lib/supabase";
import type { Comment, Post } from "@/lib/types";

type Counts = Record<string, { like: number; dislike: number; share: number }>;

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [counts, setCounts] = useState<Counts>({});
  const [drafts, setDrafts] = useState<Record<string, { name: string; body: string }>>({});
  const [openCommentForms, setOpenCommentForms] = useState<Record<string, boolean>>({});
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
          return (
            <article className="card post-card" id={`post-${post.id}`} key={post.id}>
              {post.image_url ? <div className="post-media"><img src={post.image_url} alt={post.title} /></div> : null}
              <div className="body">
                <div className="post-meta"><span>Market post</span><span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Live update"}</span></div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                {post.cta_label && post.cta_url ? <Link className="btn small gold" href={post.cta_url}>{post.cta_label}</Link> : null}
                <div className="post-actions">
                  <button className="action-btn reaction" onClick={() => react(post.id, "like")}>Like <strong>{postCounts.like}</strong></button>
                  <button className="action-btn reaction" onClick={() => react(post.id, "dislike")}>Dislike <strong>{postCounts.dislike}</strong></button>
                  <button className="action-btn reaction" onClick={() => react(post.id, "share")}>Share <strong>{postCounts.share}</strong></button>
                  <button
                    className={`action-btn reaction ${openCommentForms[post.id] ? "active" : ""}`}
                    onClick={() => setOpenCommentForms((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  >
                    Comment <strong>{(comments[post.id] || []).length}</strong>
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
