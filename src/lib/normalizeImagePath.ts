export function normalizeImagePath(p: string | null | undefined) {
  if (!p) return "";

  let s = String(p).trim();
  if (!s) return "";

  // Jika path sudah berupa URL lengkap, langsung kembalikan
  if (s.startsWith("http")) return s;

  // Hapus prefix yang tidak diperlukan
  s = s.replace(/^\.\//, "").replace(/^public\//i, "");

  // Sesuaikan dengan nama bucket kamu (di Supabase Storage)
  const BUCKET_NAME = "image"; // ganti kalau bucket kamu beda
  const SUPABASE_URL = "https://spkhkchfiqmzhzfajwju.supabase.co";

  // Bentuk URL publik ke file di Supabase Storage
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${s}`;
}
