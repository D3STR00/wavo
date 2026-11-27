import { useEffect, useState } from "react";

import BottomNav from "../components/wavo/bottom-nav";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import "./wall.css";

const photoTypes = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const photos = supabase.storage.from("wall-photos");

async function loadWall() {
  const { data, error } = await supabase
    .from("wall_posts")
    .select("id, photo_path, caption, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(50);

  if (error) throw error;
  if (!data.length) return [];

  const { data: links, error: photoError } = await photos.createSignedUrls(
    data.map(post => post.photo_path),
    3600,
  );
  if (photoError) throw photoError;
  const urls = new Map(links.map(link => [link.path, link.signedUrl]));
  return data.map(post => ({ ...post, url: urls.get(post.photo_path) }));
}

export default function WallScreen({ onGoWall, onGoNearby, onGoChat, onGoProfile }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [revision, setRevision] = useState(0);
  const [loadedRevision, setLoadedRevision] = useState(-1);
  const [loadError, setLoadError] = useState(false);
  const [postError, setPostError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const loading = loadedRevision !== revision;

  useEffect(() => {
    let current = true;

    async function refresh() {
      try {
        const nextPosts = await loadWall();
        if (current) {
          setPosts(nextPosts);
          setLoadError(false);
        }
      } catch {
        if (current) setLoadError(true);
      } finally {
        if (current) setLoadedRevision(revision);
      }
    }

    refresh();
    return () => { current = false; };
  }, [revision]);

  async function publish(event) {
    event.preventDefault();
    if (!user || publishing) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const photo = form.elements.photo.files[0];
    const extension = photoTypes[photo?.type];

    if (!extension || !photo.size || photo.size > 5 * 1024 * 1024) {
      setPostError("Choose a JPG, PNG, or WebP photo under 5 MB.");
      return;
    }

    setPublishing(true);
    setPostError("");
    try {
      let path = uploadedPhoto?.path;
      if (uploadedPhoto?.file !== photo || !path?.startsWith(`${user.id}/`)) {
        path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await photos.upload(path, photo);
        if (error) throw error;
        setUploadedPhoto({ file: photo, path });
      }

      const { error } = await supabase.from("wall_posts").insert({
        photo_path: path,
        caption: data.get("caption").trim(),
      });
      if (error && error.code !== "23505") throw error;

      form.reset();
      setUploadedPhoto(null);
      setRevision(value => value + 1);
    } catch {
      setPostError("Couldn’t publish your post. Try again.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      <main className="wall">
        <header className="wall-header">
          <h1>Wavo Wall</h1>
          <button type="button" onClick={() => setRevision(value => value + 1)} disabled={loading}>
            Refresh
          </button>
        </header>

        <form onSubmit={publish} className="wall-card wall-form">
          <fieldset disabled={publishing || !user}>
            <label htmlFor="wall-photo">Photo</label>
            <input id="wall-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
            <label htmlFor="wall-caption">Caption (optional)</label>
            <textarea id="wall-caption" name="caption" maxLength={280} rows={2} />
            <button type="submit">{publishing ? "Publishing…" : "Publish post"}</button>
          </fieldset>
          {postError && <p role="alert">{postError}</p>}
        </form>

        {loading && !posts.length && <p role="status">Loading posts…</p>}
        {!loading && loadError && <p role="alert">Couldn’t load the wall. Tap Refresh to try again.</p>}
        {!loading && !loadError && !posts.length && <p>Share the first photo on Wavo.</p>}
        {posts.map(post => (
          <article className="wall-card wall-post" key={post.id}>
            {post.url
              ? <img src={post.url} alt="Photo shared on Wavo" loading="lazy" />
              : <p>Photo unavailable.</p>}
            {post.caption && <p>{post.caption}</p>}
            <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString()}</time>
          </article>
        ))}
      </main>
      <BottomNav active="wall" onWall={onGoWall} onNearby={onGoNearby} onChat={onGoChat} onProfile={onGoProfile} />
    </>
  );
}
