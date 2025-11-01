"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  Newspaper,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeImagePath } from "@/lib/normalizeImagePath";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // FORM STATE
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "",
    bio: "",
    socials: {
      instagram: "",
      github: "",
    },
    photo: "",
    file: null as File | null,
  });

  const [galleryForm, setGalleryForm] = useState({
    type: "image",
    caption: "",
    tags: "",
    file: null as File | null,
  });

  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    content: "",
    event_date: "",
    file: null as File | null,
  });

  // --- ✅ Cek login admin ---
  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) {
      router.replace("/admin/login");
      return;
    }
    setAdmin(JSON.parse(stored));
  }, [router]);

  // Fetch data on load
  useEffect(() => {
    if (admin) fetchData();
  }, [admin]);

  const fetchData = async () => {
    try {
      const [membersRes, galleryRes, newsRes, contactsRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/gallery"),
        fetch("/api/news"),
        fetch("/api/contact"),
      ]);

      const [membersData, galleryData, newsData, contactsData] =
        await Promise.all([
          membersRes.json(),
          galleryRes.json(),
          newsRes.json(),
          contactsRes.json(),
        ]);

      setMembers(membersData || []);
      setGallery(galleryData || []);
      setNews(newsData || []);
      setContacts(contactsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // sanitize input filenames before saving
  function normalizeInputForSave(p: string) {
    if (!p) return "";
    let s = p.trim();
    if (!s.includes("/")) s = "image/" + s;
    s = s.replace(/^\//, "");
    s = s.replace(/^public\//i, "");
    return s;
  }

  // ==================== MEMBERS ====================
  const handleCreateMember = async () => {
    if (!memberForm.name || !memberForm.role) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", memberForm.name);
    formData.append("role", memberForm.role);
    formData.append("bio", memberForm.bio);
    formData.append(
      "socials",
      JSON.stringify({
        instagram: memberForm.socials.instagram,
        github: memberForm.socials.github,
      })
    );
    if (memberForm.file) formData.append("photo", memberForm.file);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("✅ Member added!");
        setMemberForm({
          name: "",
          role: "",
          bio: "",
          photo: "",
          file: null,
          socials: { instagram: "", github: "" },
        });
        setPreviewUrl(null);
        fetchData();
      } else {
        alert("❌ Failed to upload member");
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error uploading member");
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch("/api/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("🗑️ Member deleted!");
        fetchData();
      } else {
        alert("❌ Failed to delete member");
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error deleting member");
    }
  };

  // ==================== GALLERY ====================
const handleCreateGallery = async () => {
  if (!galleryForm.file) {
    alert("Please select a file first.");
    return;
  }

  const file = galleryForm.file;
  // batasi ukuran (opsional) - 100 MB
  const MAX_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    alert("Ukuran file terlalu besar. Maks 100MB.");
    return;
  }

  try {
    const ext = file.name.split(".").pop();
    const isVideo = file.type.startsWith("video") || ["mp4","mov","avi","mkv","webm"].includes((ext||"").toLowerCase());
    const folder = isVideo ? "videos" : "images";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // Upload ke Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("image")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase uploadError:", uploadError);
      // Beri pesan lebih jelas ke user jika permission issue
      if ((uploadError as any).status === 403) {
        alert("Upload ditolak: permission bucket. Cek policy bucket di Supabase (insert permission).");
      } else {
        alert("Upload ke Supabase gagal: " + uploadError.message);
      }
      return;
    }

    // Ambil public URL
    const { data: urlData } = supabase.storage.from("image").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    if (!publicUrl) {
      console.error("No publicUrl returned", urlData);
      alert("Gagal mengambil public URL.");
      return;
    }

    // Kirim metadata ke API (sama seperti sebelumnya)
    const response = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: isVideo ? "video" : "image",
        caption: galleryForm.caption,
        tags: galleryForm.tags,
        file_path: publicUrl,
      }),
    });

    if (response.ok) {
      alert("✅ Gallery item created!");
      setGalleryForm({ type: "image", caption: "", tags: "", file: null });
      setPreviewUrl(null);
      fetchData();
    } else {
      const errText = await response.text().catch(() => "");
      console.error("Failed saving metadata:", errText);
      alert("❌ Failed to save metadata.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("❌ Upload failed: " + (error as any)?.message ?? "unknown");
  }
};
    

  // ==================== NEWS ====================
  const handleCreateNews = async () => {
    if (!newsForm.title) {
      alert("Please enter a news title.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newsForm.title);
    formData.append("summary", newsForm.summary);
    formData.append("content", newsForm.content);
    formData.append("event_date", newsForm.event_date);
    if (newsForm.file) formData.append("file", newsForm.file);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("✅ News added!");
        setNewsForm({
          title: "",
          summary: "",
          content: "",
          event_date: "",
          file: null,
        });
        setPreviewUrl(null);
        fetchData();
      } else {
        const err = await res.json();
        console.error(err);
        alert("❌ Failed to create news");
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error creating news");
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("🗑️ News deleted!");
        fetchData();
      } else {
        alert("❌ Failed to delete news");
      }
    } catch (e) {
      console.error(e);
      alert("❌ Error deleting news");
    }
  };

  if (!admin) {
    return (
      <div className="p-6 text-gray-500 flex justify-center items-center min-h-screen">
        Checking admin session...
      </div>
    );
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">⚙️ Admin Dashboard</h2>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem("adminUser");
            router.push("/admin/login");
          }}
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" /> Members
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <ImageIcon className="w-4 h-4 mr-2" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="w-4 h-4 mr-2" /> News
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Mail className="w-4 h-4 mr-2" /> Contacts
          </TabsTrigger>
        </TabsList>

        {/* =================== MEMBERS =================== */}
        <TabsContent value="members">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <input
                  className="border rounded p-2"
                  placeholder="Name"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                />
                <input
                  className="border rounded p-2"
                  placeholder="Role"
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, role: e.target.value })
                  }
                />
                <textarea
                  className="border rounded p-2"
                  placeholder="Bio"
                  value={memberForm.bio}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, bio: e.target.value })
                  }
                />

                {/* Input Instagram & GitHub */}
                <input
                  className="border rounded p-2"
                  placeholder="Instagram URL"
                  value={memberForm.socials.instagram}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      socials: {
                        ...memberForm.socials,
                        instagram: e.target.value,
                      },
                    })
                  }
                />
                <input
                  className="border rounded p-2"
                  placeholder="GitHub URL"
                  value={memberForm.socials.github}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      socials: {
                        ...memberForm.socials,
                        github: e.target.value,
                      },
                    })
                  }
                />

                {/* Upload file */}
                <input
                  type="file"
                  accept="image/*"
                  className="border rounded p-2"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMemberForm({ ...memberForm, file });
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* Preview foto */}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mt-2"
                  />
                )}

                <Button onClick={handleCreateMember} className="w-fit">
                  <Plus className="w-4 h-4 mr-2" /> Membuat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Daftar member */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {members.map((m: any) => (
              <Card key={m.id} className="overflow-hidden">
                <div className="aspect-square flex items-center justify-center bg-gray-50">
                  {m.photo ? (
                    <img
                      src={normalizeImagePath(m.photo)}
                      alt={m.name}
                      className="object-cover w-full h-48"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No photo</div>
                  )}
                </div>

                <CardContent className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.bio}</p>

                    {m.socials && (
                      <div className="flex space-x-2 mt-2">
                        {m.socials.instagram && (
                          <a
                            href={m.socials.instagram}
                            target="_blank"
                            className="text-pink-500 text-sm underline"
                          >
                            Instagram
                          </a>
                        )}
                        {m.socials.github && (
                          <a
                            href={m.socials.github}
                            target="_blank"
                            className="text-gray-700 text-sm underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMember(m.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* =================== GALLERY =================== */}
        <TabsContent value="gallery">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create Gallery Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {/* Pilihan jenis konten */}
                <select
                  className="border rounded p-2"
                  value={galleryForm.type}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, type: e.target.value })
                  }
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                {/* Upload file */}
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="border rounded p-2"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setGalleryForm({ ...galleryForm, file });
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-2">
                    {galleryForm.type === "video" ? (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* Input Caption & Tags */}
                <input
                  className="border rounded p-2"
                  placeholder="Caption"
                  value={galleryForm.caption}
                  onChange={(e) =>
                    setGalleryForm({
                      ...galleryForm,
                      caption: e.target.value,
                    })
                  }
                />
                <input
                  className="border rounded p-2"
                  placeholder="Tags (pisahkan dengan koma)"
                  value={galleryForm.tags}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, tags: e.target.value })
                  }
                />

                {/* Tombol Create */}
                <Button onClick={handleCreateGallery} className="w-fit">
                  <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Galeri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.map((g: any) => (
              <Card key={g.id} className="overflow-hidden">
                {g.type?.toLowerCase() === "image" ? (
                  <div className="aspect-video flex items-center justify-center bg-gray-50">
                    {g.file_path ? (
                      <img
                        src={normalizeImagePath(g.file_path)}
                        alt={g.caption}
                        className="object-cover w-full h-48"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">No image</div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <video
                      src={normalizeImagePath(g.file_path)}
                      controls
                      className="object-cover w-full h-48"
                    />
                  </div>
                )}

                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{g.caption}</p>
                    <p className="text-sm text-gray-500">{g.tags}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteGallery(g.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* =================== NEWS =================== */}
        <TabsContent value="news">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <input
                  className="border rounded p-2"
                  placeholder="Title"
                  value={newsForm.title}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, title: e.target.value })
                  }
                />
                <input
                  className="border rounded p-2"
                  placeholder="Summary"
                  value={newsForm.summary}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, summary: e.target.value })
                  }
                />
                <textarea
                  className="border rounded p-2"
                  placeholder="Content"
                  value={newsForm.content}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, content: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border rounded p-2"
                  value={newsForm.event_date}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, event_date: e.target.value })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="border rounded p-2"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewsForm({ ...newsForm, file });
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mt-2"
                  />
                )}

                <Button onClick={handleCreateNews} className="w-fit">
                  <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* daftar news */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((n: any) => (
              <Card key={n.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-50 flex items-center justify-center">
                  {n.featured_image ? (
                    <img
                      src={normalizeImagePath(n.featured_image)}
                      alt={n.title}
                      className="object-cover w-full h-48"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No image</div>
                  )}
                </div>
                <CardContent className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{n.title}</p>
                    <p className="text-sm text-gray-600">{n.summary}</p>
                    {n.event_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Event: {new Date(n.event_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNews(n.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* =================== CONTACTS =================== */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.subject}</TableCell>
                      <TableCell>{c.message}</TableCell>
                      <TableCell>
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
