"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Comment, Post, Product, Quote, QuoteMessage } from "@/lib/types";

type Tab = "overview" | "posts" | "products" | "quotes" | "comments";

const ADMIN_PASSCODE = "Admin@.7";
const ADMIN_SESSION_KEY = "easyharvest_admin_passcode_ok";

const sitePages = [
  { label: "No action button", value: "" },
  { label: "Home", value: "/" },
  { label: "Products", value: "/products" },
  { label: "About", value: "/about" },
  { label: "Documentation", value: "/documentation" },
  { label: "Export Process", value: "/export-process" },
  { label: "Request Quote", value: "/contact" },
  { label: "Track Quote", value: "/track" }
];

export function AdminConsole() {
  const [tab, setTab] = useState<Tab>("overview");
  const [passcode, setPasscode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteMessages, setQuoteMessages] = useState<Record<string, QuoteMessage[]>>({});
  const [quoteReplies, setQuoteReplies] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentReplies, setCommentReplies] = useState<Record<string, string>>({});
  const [newPost, setNewPost] = useState({ title: "", body: "", image_url: "", cta_label: "", cta_url: "" });
  const [postImage, setPostImage] = useState<File | null>(null);
  const [editingPostId, setEditingPostId] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", summary: "", description: "", image_url: "", specs: "" });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    setIsAdmin(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
  }, []);

  useEffect(() => {
    async function load() {
      if (!supabase || !isAdmin) return;
      const [postRows, productRows, quoteRows, commentRows] = await Promise.all([
        supabase.from("posts").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: false })
      ]);
      if (postRows.data?.length) setPosts(postRows.data as Post[]);
      if (productRows.data?.length) setProducts(productRows.data as Product[]);
      if (quoteRows.data) setQuotes(quoteRows.data as Quote[]);
      if (commentRows.data) setComments(commentRows.data as Comment[]);
      if (quoteRows.data?.length) {
        const quoteIds = quoteRows.data.map((quote) => quote.id);
        const { data: messageRows } = await supabase.from("quote_messages").select("*").in("quote_id", quoteIds).order("created_at", { ascending: true });
        setQuoteMessages(groupQuoteMessages((messageRows || []) as QuoteMessage[]));
      }
    }
    load();
  }, [isAdmin]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAdmin(true);
      setNotice("");
      return;
    }
    setNotice("Incorrect admin passcode.");
  }

  function signOut() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    setPasscode("");
  }

  async function addPost(event: React.FormEvent) {
    event.preventDefault();
    setBusy("post");
    setNotice("");
    try {
      const imageUrl = postImage ? await uploadAsset(postImage, "posts") : newPost.image_url;
      const row = { ...newPost, image_url: imageUrl, published: true };
      if (supabase) {
        if (editingPostId) {
          const { data, error } = await supabase.from("posts").update(row).eq("id", editingPostId).select("*").single();
          if (error) throw new Error(`Post update failed: ${error.message}`);
          setPosts((prev) => prev.map((post) => post.id === editingPostId ? data as Post : post));
        } else {
          const { data, error } = await supabase.from("posts").insert(row).select("*").single();
          if (error) throw new Error(`Post insert failed: ${error.message}`);
          setPosts((prev) => [data as Post, ...prev]);
        }
      }
      resetPostForm();
      setShowPostForm(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not publish post.");
    } finally {
      setBusy("");
    }
  }

  async function addProduct(event: React.FormEvent) {
    event.preventDefault();
    setBusy("product");
    setNotice("");
    try {
      const imageUrl = productImage ? await uploadAsset(productImage, "products") : newProduct.image_url;
      const row = {
        name: newProduct.name,
        summary: newProduct.summary,
        description: newProduct.description,
        image_url: imageUrl,
        slug: slugify(newProduct.name),
        specs: newProduct.specs.split(",").map((item) => item.trim()).filter(Boolean),
        active: true
      };
      if (supabase) {
        if (editingProductId) {
          const { data, error } = await supabase.from("products").update(row).eq("id", editingProductId).select("*").single();
          if (error) throw new Error(`Product update failed: ${error.message}`);
          setProducts((prev) => prev.map((product) => product.id === editingProductId ? data as Product : product));
        } else {
          const { data, error } = await supabase.from("products").insert(row).select("*").single();
          if (error) throw new Error(`Product insert failed: ${error.message}`);
          setProducts((prev) => [data as Product, ...prev]);
        }
      }
      resetProductForm();
      setShowProductForm(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setBusy("");
    }
  }

  function editPost(post: Post) {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      body: post.body,
      image_url: post.image_url || "",
      cta_label: post.cta_label || "",
      cta_url: post.cta_url || ""
    });
    setPostImage(null);
    setShowPostForm(true);
  }

  function editProduct(product: Product) {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      summary: product.summary,
      description: product.description,
      image_url: product.image_url,
      specs: (product.specs || []).join(", ")
    });
    setProductImage(null);
    setShowProductForm(true);
  }

  async function deletePost(post: Post) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    setBusy(`delete-post-${post.id}`);
    setNotice("");
    const { error } = await supabase!.from("posts").delete().eq("id", post.id);
    if (error) setNotice(`Post delete failed: ${error.message}`);
    else setPosts((prev) => prev.filter((item) => item.id !== post.id));
    setBusy("");
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    setBusy(`delete-product-${product.id}`);
    setNotice("");
    const { error } = await supabase!.from("products").delete().eq("id", product.id);
    if (error) setNotice(`Product delete failed: ${error.message}`);
    else setProducts((prev) => prev.filter((item) => item.id !== product.id));
    setBusy("");
  }

  function resetPostForm() {
    setEditingPostId("");
    setNewPost({ title: "", body: "", image_url: "", cta_label: "", cta_url: "" });
    setPostImage(null);
  }

  function resetProductForm() {
    setEditingProductId("");
    setNewProduct({ name: "", summary: "", description: "", image_url: "", specs: "" });
    setProductImage(null);
  }

  async function updateQuote(quote: Quote, status: string) {
    setQuotes((prev) => prev.map((item) => item.id === quote.id ? { ...item, status } : item));
    if (supabase) await supabase.from("quotes").update({ status }).eq("id", quote.id);
  }

  async function replyToQuote(quote: Quote) {
    const message = quoteReplies[quote.id]?.trim();
    if (!message) return;
    if (supabase) {
      const { data, error } = await supabase.from("quote_messages").insert({ quote_id: quote.id, sender_name: "EasyHarvest Team", sender_role: "admin", message }).select("*").single();
      if (error) {
        setNotice(`Quote reply failed: ${error.message}`);
        return;
      }
      setQuoteMessages((prev) => ({ ...prev, [quote.id]: [...(prev[quote.id] || []), data as QuoteMessage] }));
      setQuoteReplies((prev) => ({ ...prev, [quote.id]: "" }));
    }
  }

  async function replyToComment(comment: Comment) {
    const reply = commentReplies[comment.id]?.trim();
    if (!reply || !supabase) return;
    const { data, error } = await supabase
      .from("comments")
      .update({ admin_reply: reply, admin_replied_at: new Date().toISOString() })
      .eq("id", comment.id)
      .select("*")
      .single();
    if (error) {
      setNotice(`Comment reply failed: ${error.message}`);
      return;
    }
    setComments((prev) => prev.map((item) => item.id === comment.id ? data as Comment : item));
    setCommentReplies((prev) => ({ ...prev, [comment.id]: "" }));
  }

  if (!isAdmin) {
    return (
      <form className="card form-panel form-grid" onSubmit={signIn}>
        <h3>Admin passcode</h3>
        <p>Enter the owner passcode to open the EasyHarvest operations console.</p>
        <input className="input" type="password" required placeholder="Enter passcode" value={passcode} onChange={(event) => setPasscode(event.target.value)} />
        <button className="btn">Unlock Dashboard</button>
        {notice ? <div className="notice">{notice}</div> : null}
      </form>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="card admin-menu">
        {(["overview", "posts", "products", "quotes", "comments"] as Tab[]).map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{title(item)}</button>
        ))}
      </aside>
      <section className="grid">
        <div className="notice admin-session-notice">
          <span>{notice || "Dashboard unlocked with admin passcode."}</span>
          <button className="action-btn" onClick={signOut}>Lock</button>
        </div>
        {tab === "overview" ? <Overview posts={posts.length} products={products.length} quotes={quotes.length} comments={comments.length} /> : null}
        {tab === "posts" ? (
          <>
            <div className="admin-tab-head">
              <div>
                <span className="eyebrow">Posts</span>
                <h3>Published updates</h3>
              </div>
              <button className="btn" onClick={() => {
                if (!showPostForm) resetPostForm();
                setShowPostForm((value) => !value);
              }}>{showPostForm ? "Close Form" : "Add Post"}</button>
            </div>
            {showPostForm ? (
              <form className="card form-panel form-grid" onSubmit={addPost}>
                <h3>{editingPostId ? "Update home page post" : "Add home page post"}</h3>
                <input className="input" required placeholder="Post title" value={newPost.title} onChange={(event) => setNewPost({ ...newPost, title: event.target.value })} />
                <label className="upload-field">
                  <span>{postImage ? postImage.name : editingPostId ? "Choose a new image or keep existing" : "Choose post image from device"}</span>
                  <input type="file" accept="image/*" onChange={(event) => setPostImage(event.target.files?.[0] || null)} />
                </label>
                <textarea className="textarea" required placeholder="Write-up" value={newPost.body} onChange={(event) => setNewPost({ ...newPost, body: event.target.value })} />
                <div className="grid two">
                  <input className="input" placeholder="Action button label" value={newPost.cta_label} onChange={(event) => setNewPost({ ...newPost, cta_label: event.target.value })} />
                  <select className="select" value={newPost.cta_url} onChange={(event) => setNewPost({ ...newPost, cta_url: event.target.value })}>
                    {sitePages.map((page) => <option key={page.value || "none"} value={page.value}>{page.label}</option>)}
                  </select>
                </div>
                <button className="btn" disabled={busy === "post"}>{busy === "post" ? "Saving..." : editingPostId ? "Update Post" : "Publish Post"}</button>
              </form>
            ) : null}
            <div className="table-list">
              {posts.map((post) => (
                <article className="card row-card admin-record" key={post.id}>
                  {post.image_url ? <img src={post.image_url} alt={post.title} /> : null}
                  <div>
                    <strong>{post.title}</strong>
                    <p>{post.body}</p>
                    <div className="post-actions">
                      <button className="action-btn" onClick={() => editPost(post)}>Edit</button>
                      <button className="action-btn danger" disabled={busy === `delete-post-${post.id}`} onClick={() => deletePost(post)}>{busy === `delete-post-${post.id}` ? "Deleting..." : "Delete"}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
        {tab === "products" ? (
          <>
            <div className="admin-tab-head">
              <div>
                <span className="eyebrow">Products</span>
                <h3>Commodity catalog</h3>
              </div>
              <button className="btn" onClick={() => {
                if (!showProductForm) resetProductForm();
                setShowProductForm((value) => !value);
              }}>{showProductForm ? "Close Form" : "Add Product"}</button>
            </div>
            {showProductForm ? (
              <form className="card form-panel form-grid" onSubmit={addProduct}>
                <h3>{editingProductId ? "Update product" : "Add product"}</h3>
                <input className="input" required placeholder="Product name" value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} />
                <label className="upload-field">
                  <span>{productImage ? productImage.name : editingProductId ? "Choose a new image or keep existing" : "Choose product image from device"}</span>
                  <input type="file" accept="image/*" onChange={(event) => setProductImage(event.target.files?.[0] || null)} />
                </label>
                <textarea className="textarea" required placeholder="Short summary" value={newProduct.summary} onChange={(event) => setNewProduct({ ...newProduct, summary: event.target.value })} />
                <textarea className="textarea" placeholder="Full description" value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} />
                <input className="input" placeholder="Specs, separated by commas" value={newProduct.specs} onChange={(event) => setNewProduct({ ...newProduct, specs: event.target.value })} />
                <button className="btn" disabled={busy === "product"}>{busy === "product" ? "Saving..." : editingProductId ? "Update Product" : "Save Product"}</button>
              </form>
            ) : null}
            <div className="table-list">
              {products.map((product) => (
                <article className="card row-card admin-record" key={product.id}>
                  {product.image_url ? <img src={product.image_url} alt={product.name} /> : null}
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.summary}</p>
                    <div className="post-actions">
                      <button className="action-btn" onClick={() => editProduct(product)}>Edit</button>
                      <button className="action-btn danger" disabled={busy === `delete-product-${product.id}`} onClick={() => deleteProduct(product)}>{busy === `delete-product-${product.id}` ? "Deleting..." : "Delete"}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
        {tab === "quotes" ? (
          <div className="table-list">
            {quotes.map((quote) => (
              <article className="card row-card" key={quote.id}>
                <div className="row-top">
                  <div><strong>{quote.buyer_name}</strong><p>{quote.product_interest} · {quote.quantity} · {quote.destination}</p>{quote.contact_number ? <p>{quote.contact_number}</p> : null}</div>
                  <span className="badge">{quote.status}</span>
                </div>
                <div className="quote-detail-grid">
                  <p><strong>Email:</strong> {quote.email}</p>
                  <p><strong>Company:</strong> {quote.company || "Not provided"}</p>
                  <p><strong>Tracking:</strong> {quote.tracking_code}</p>
                  <p><strong>Submitted:</strong> {quote.created_at ? new Date(quote.created_at).toLocaleString() : "Unknown"}</p>
                </div>
                <p>{quote.message}</p>
                <div className="comments quote-thread">
                  {(quoteMessages[quote.id] || []).map((message) => (
                    <div className={`comment ${message.sender_role === "admin" ? "admin-message" : ""}`} key={message.id}>
                      <strong>{message.sender_name} · {message.sender_role}</strong>
                      <p>{message.message}</p>
                    </div>
                  ))}
                </div>
                <div className="post-actions">
                  {["submitted", "reviewing", "quoted", "negotiating", "closed"].map((status) => <button className="action-btn" key={status} onClick={() => updateQuote(quote, status)}>{status}</button>)}
                </div>
                <div className="reply-box">
                  <textarea className="textarea" placeholder="Reply to this quote" value={quoteReplies[quote.id] || ""} onChange={(event) => setQuoteReplies((prev) => ({ ...prev, [quote.id]: event.target.value }))} />
                  <button className="btn small" onClick={() => replyToQuote(quote)}>Send Quote Reply</button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {tab === "comments" ? (
          <div className="table-list">
            {comments.map((comment) => (
              <article className="card row-card" key={comment.id}>
                <div className="row-top">
                  <div>
                    <strong>{comment.author_name}</strong>
                    <p>{comment.body}</p>
                    {comment.admin_reply ? <div className="admin-reply"><strong>EasyHarvest Team</strong><p>{comment.admin_reply}</p></div> : null}
                  </div>
                  <span className="badge">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "Comment"}</span>
                </div>
                <div className="reply-box">
                  <textarea className="textarea" placeholder="Reply to this comment" value={commentReplies[comment.id] || ""} onChange={(event) => setCommentReplies((prev) => ({ ...prev, [comment.id]: event.target.value }))} />
                  <button className="btn small" onClick={() => replyToComment(comment)}>{comment.admin_reply ? "Update Reply" : "Reply to Comment"}</button>
                </div>
              </article>
            ))}
          </div>
        ) : null}      </section>
    </div>
  );
}

function Overview(props: { posts: number; products: number; quotes: number; comments: number }) {
  return (
    <div className="grid four">
      {Object.entries(props).map(([key, value]) => (
        <div className="card form-panel" key={key}>
          <span className="eyebrow">{title(key)}</span>
          <h3>{value}</h3>
        </div>
      ))}
    </div>
  );
}

function List({ rows }: { rows: { title: string; body: string }[] }) {
  return (
    <div className="table-list">
      {rows.map((row, index) => (
        <article className="card row-card" key={`${row.title}-${index}`}>
          <strong>{row.title}</strong>
          <p>{row.body}</p>
        </article>
      ))}
    </div>
  );
}

function groupQuoteMessages(rows: QuoteMessage[]) {
  return rows.reduce<Record<string, QuoteMessage[]>>((acc, row) => {
    acc[row.quote_id] ||= [];
    acc[row.quote_id].push(row);
    return acc;
  }, {});
}

async function uploadAsset(file: File, folder: "posts" | "products") {
  if (!supabase) return "";
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return data.publicUrl;
}

function title(value: string) {
  return value.replace(/^\w/, (char) => char.toUpperCase());
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}


