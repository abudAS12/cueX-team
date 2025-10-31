"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Image,
  Calendar,
  Mail,
  Star,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { normalizeImagePath } from "@/lib/normalizeImagePath";
import { VolumeX, Volume2 } from "lucide-react";

// ⌨️ Hook untuk efek typing
function useTypingEffect(words: string[], speed = 150, pause = 1500) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timer: NodeJS.Timeout;

    if (deleting) {
      timer = setTimeout(() => {
        setDisplay((prev) => prev.slice(0, -1));
        if (display === "") {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }, speed / 2);
    } else {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, display.length + 1));
        if (display === current) {
          setTimeout(() => setDeleting(true), pause);
        }
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [display, deleting, index, words, speed, pause]);

  return display;
}

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const typedText = useTypingEffect(["CueXs Team"], 120, 1500);
  useEffect(() => {
    // Aktifkan scroll halus di seluruh halaman
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);
  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchMembers();
    fetchGallery();
    fetchNews();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Modal state for news article detail view
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const openModal = (article: any) => {
    setSelectedArticle(article);
    setShowModal(true);
    // prevent background scroll when modal is open
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden 
      bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      >
        {/* 🌈 Background bergerak */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 opacity-20 blur-3xl"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* 🌟 Efek partikel cahaya lembut */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60 blur-sm"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: Math.random() * 0.8 + 0.4,
              }}
              animate={{
                y: ["0%", "100%"],
                x: ["0%", "100%"],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* ✨ Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>

        {/* 🧊 Konten Teks */}
        <div className="relative z-10 flex-1 text-center md:text-left space-y-6 py-20 backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg p-10">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            {/* Efek typing di sini */}
            <span className="text-gray-900 dark:text-white">
              {typedText}
              <motion.span
                className="ml-1 inline-block w-[2px] h-10 bg-pink-500 align-middle"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0"
          >
            Kami adalah kumpulan orang-orang cueks — tapi kalau sudah kompak,
            hasilnya meledak 💥
          </motion.p>

          {/* Tombol */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button
              size="lg"
              onClick={() => {
                const gallerySection = document.getElementById("gallery");
                if (gallerySection) {
                  gallerySection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105
              shadow-lg hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] transition-all duration-500 group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-500"></span>
              <span className="relative flex items-center z-10">
                Jelajahi Kami..
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-500/50 hover:border-pink-500/70 text-purple-600 dark:text-pink-300 hover:scale-105 transition-all duration-500"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>

        {/* 🌠 Foto Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex-1 flex justify-center items-center mt-10 md:mt-0"
        >
          <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-3xl overflow-hidden group shadow-[0_0_60px_rgba(217,70,239,0.25)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-400 to-indigo-500 opacity-40 blur-3xl animate-[spin_12s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-400/30 to-transparent opacity-70 blur-2xl animate-pulse"></div>

            <motion.img
              src="/image/cueks.jpeg"
              alt="foto"
              className="relative z-10 w-full h-full object-cover rounded-3xl"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Efek refleksi lembut */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-30 rotate-45 translate-y-5 pointer-events-none"></div>

            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-500/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </motion.div>

        {/* 🧭 Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full"></div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                About Us
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              CueXs Team was founded with a vision to bring creativity and
              innovation together. Our team consists of talented individuals who
              share a common passion for excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {[
                {
                  icon: (
                    <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Innovation First",
                  desc: "We push boundaries and explore new possibilities in every project we undertake.",
                  color: "bg-purple-100 dark:bg-purple-900",
                },
                {
                  icon: (
                    <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  ),
                  title: "Team Collaboration",
                  desc: "Our strength lies in our diverse skills and unified vision for creating exceptional experiences.",
                  color: "bg-pink-100 dark:bg-pink-900",
                },
                {
                  icon: (
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Proven Track Record",
                  desc: "Successfully delivered numerous projects that exceed client expectations.",
                  color: "bg-purple-100 dark:bg-purple-900",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center"
            >
              <div
                className="group relative rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(147,51,234,0.25)] transform-gpu transition-all duration-700 ease-out"
                onMouseMove={(e) => {
                  if (window.innerWidth < 768) return;
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateX = ((y - rect.height / 2) / 20) * -1;
                  const rotateY = (x - rect.width / 2) / 20;
                  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                  const light = card.querySelector(".light") as HTMLElement;
                  if (light) {
                    const moveX = (x / rect.width) * 100;
                    const moveY = (y / rect.height) * 100;
                    light.style.background = `radial-gradient(circle at ${moveX}% ${moveY}%, rgba(255,255,255,0.35), transparent 60%)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth < 768) return;
                  const card = e.currentTarget;
                  card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                  const light = card.querySelector(".light") as HTMLElement;
                  if (light) light.style.background = "none";
                }}
              >
                <img
                  src="/image/cueks1.jpeg"
                  alt="About Cueks"
                  className="w-full h-96 object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>
                <div className="light absolute inset-0 pointer-events-none transition-all duration-300 ease-out"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out drop-shadow-lg">
                  The Creative Team
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section
        id="members"
        className="relative py-28 bg-gradient-to-b from-gray-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 overflow-hidden"
      >
        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/10 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/10 blur-3xl rounded-full translate-x-1/4 translate-y-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Ini adalah <span className="italic">CueXs Team</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              silahkan kenalan dengan orang-orang di balik layar
            </p>
          </motion.div>

          {/* Members Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {members.map((member: any, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group relative"
              >
                <Card
                  className="relative overflow-hidden border border-purple-200/40 dark:border-purple-800/40 rounded-3xl 
              bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl 
              hover:shadow-[0_0_60px_rgba(168,85,247,0.35)] transition-all duration-500"
                >
                  {/* Gradient glow border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 opacity-20 group-hover:opacity-40 blur-md transition-all"></div>

                  <CardHeader className="relative flex flex-col items-center pt-5 z-10">
                    {/* Foto */}
                    {member.photo ? (
                      <div className="relative w-44 h-44 mb-2">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-purple-600 opacity-40 blur-sm animate-spin-slow"></div>
                        <img
                          src={normalizeImagePath(member.photo)}
                          alt={member.name}
                          className="relative z-10 w-full h-full object-cover rounded-full border-[5px] border-white dark:border-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-44 h-44 mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-4xl font-bold shadow-lg">
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                      {member.name}
                    </h3>

                    <p className="mt-2 px-4 py-1 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-sm">
                      {member.role}
                    </p>
                  </CardHeader>

                  <CardContent className="z-10 relative">
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Socials */}
                    <div className="flex justify-center gap-5">
                      {member.socials &&
                        typeof member.socials === "object" &&
                        Object.entries(member.socials).map(
                          ([platform, url]) => {
                            const icons: { [key: string]: any } = {
                              twitter: Twitter,
                              linkedin: Linkedin,
                              github: Github,
                              instagram: Instagram,
                            };
                            const Icon = icons[platform];
                            if (Icon && url) {
                              return (
                                <a
                                  key={platform}
                                  href={url as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative p-2.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:scale-110 transition-all duration-300"
                                >
                                  <div className="absolute inset-0 rounded-full bg-white/20 blur-sm"></div>
                                  <Icon className="relative text-white w-5 h-5" />
                                </a>
                              );
                            }
                            return null;
                          }
                        )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden select-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              inilah kegiatan kami dan kenangan kami
            </p>
          </motion.div>

          {/* CAROUSEL */}
          <motion.div
            className="relative flex items-center justify-center h-[320px] md:h-[380px] overflow-hidden perspective-1000"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.offset.x < -100) {
                setCurrentIndex((prev) => (prev + 1) % gallery.length);
              } else if (info.offset.x > 100) {
                setCurrentIndex(
                  (prev) => (prev - 1 + gallery.length) % gallery.length
                );
              }
            }}
          >
            {gallery.map((item: any, index: number) => {
              const isActive = index === currentIndex;
              const prevIndex =
                (currentIndex - 1 + gallery.length) % gallery.length;
              const nextIndex = (currentIndex + 1) % gallery.length;

              let styleClass =
                "absolute opacity-0 scale-75 blur-md transition-all duration-700";
              let rotation = 0;
              let translateX = "0";

              if (index === prevIndex) {
                styleClass =
                  "absolute left-0 scale-75 opacity-70 blur-sm z-10 transition-all duration-700";
                rotation = 15;
                translateX = "-40%";
              } else if (index === nextIndex) {
                styleClass =
                  "absolute right-0 scale-75 opacity-70 blur-sm z-10 transition-all duration-700";
                rotation = -15;
                translateX = "40%";
              } else if (isActive) {
                styleClass =
                  "relative scale-100 opacity-100 blur-0 z-30 transition-all duration-700";
                rotation = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  className={`w-[70%] md:w-[500px] h-[280px] md:h-[350px] cursor-pointer ${styleClass}`}
                  style={{
                    transform: `translateX(${translateX}) rotateY(${rotation}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.3)] group">
                    {item.type?.toLowerCase() === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={normalizeImagePath(item.file_path)}
                          autoPlay={isActive}
                          loop
                          muted={isMuted}
                          playsInline
                          controls={false}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted((prev) => !prev);
                          }}
                          className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70 transition"
                          whileTap={{ scale: 0.9 }}
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    ) : (
                      <img
                        src={normalizeImagePath(item.file_path)}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-semibold drop-shadow-lg">
                        {item.caption}
                      </h3>
                      {item.tags && (
                        <p className="text-gray-300 mt-2 text-sm">
                          {item.tags.split(",").join(" • ")}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* TOMBOL NAVIGASI */}
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? gallery.length - 1 : currentIndex - 1
                )
              }
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition z-50"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === gallery.length - 1 ? 0 : currentIndex + 1
                )
              }
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition z-50"
            >
              ›
            </button>
          </motion.div>

          {/* VIEW ALL + POPUP */}
          <div className="text-center mt-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold"
                >
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gallery.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="relative rounded-xl overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedIndex(index)}
                    >
                      {item.type?.toLowerCase() === "video" ? (
                        <video
                          src={normalizeImagePath(item.file_path)}
                          className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
                          controls
                          playsInline
                        />
                      ) : (
                        <img
                          src={normalizeImagePath(item.file_path)}
                          alt={item.caption}
                          className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 transition duration-500 p-3 flex flex-col justify-end">
                        <p className="text-white text-sm font-semibold">
                          {item.caption}
                        </p>
                        {item.tags && (
                          <span className="text-xs text-gray-300">
                            {item.tags.split(",").join(" • ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* LIGHTBOX / FULLSCREEN */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              key="lightbox"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                key={selectedIndex}
                className="relative w-[90vw] md:w-[70vw] h-[80vh] rounded-2xl overflow-hidden"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {gallery[selectedIndex].type?.toLowerCase() === "video" ? (
                  <video
                    src={normalizeImagePath(gallery[selectedIndex].file_path)}
                    controls
                    autoPlay
                    className="w-full h-full object-contain rounded-2xl"
                    playsInline
                  />
                ) : (
                  <img
                    src={normalizeImagePath(gallery[selectedIndex].file_path)}
                    alt={gallery[selectedIndex].caption}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                )}

                {/* TEKS STAY (tidak hanya saat hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 flex flex-col justify-end p-8">
                  <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                    {gallery[selectedIndex].caption}
                  </h2>
                  {gallery[selectedIndex].tags && (
                    <p className="text-gray-300 mt-2">
                      {gallery[selectedIndex].tags.split(",").join(" • ")}
                    </p>
                  )}
                </div>

                {/* Navigasi */}
                <button
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === 0
                        ? gallery.length - 1
                        : selectedIndex - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === gallery.length - 1
                        ? 0
                        : selectedIndex + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  ›
                </button>

                {/* Tombol close */}
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* News Section */}
      <section
        id="news"
        className="relative py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
      >
        {/* Background gradient blob animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                berita terbaru kami
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              kegiatan terbaru dan update dari CueXs Team
            </p>
          </motion.div>

          {/* News Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((article: any, index: number) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <div className="backdrop-blur-md bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={normalizeImagePath(article.featured_image)}
                      alt={article.title}
                      className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-70"></div>
                    <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-pink-500 transition-colors duration-300">
                      {article.title}
                    </h3>

                    {article.event_date && (
                      <p className="text-sm text-purple-500 font-medium mb-2">
                        📅 Event:{" "}
                        {new Date(article.event_date).toLocaleDateString()}
                      </p>
                    )}

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.summary || "No summary available."}
                    </p>

                    <div className="flex justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(article)}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                      >
                        Read More
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {news.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-16 text-gray-500 dark:text-gray-400"
            >
              <p>No news articles yet. Stay tuned!</p>
            </motion.div>
          )}
        </div>

        {/* Modal Detail Artikel */}
        <AnimatePresence>
          {showModal && selectedArticle && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                // ✅ Tutup modal jika klik area luar
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-xl font-bold"
                >
                  ✕
                </button>

                <img
                  src={normalizeImagePath(selectedArticle.featured_image)}
                  alt={selectedArticle.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />

                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {selectedArticle.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Published:{" "}
                  {new Date(selectedArticle.created_at).toLocaleDateString()}
                </p>

                {selectedArticle.event_date && (
                  <p className="text-sm text-purple-500 mb-3">
                    📅 Event:{" "}
                    {new Date(selectedArticle.event_date).toLocaleDateString()}
                  </p>
                )}

                {/* ✅ Konten tetap muncul baik HTML maupun teks biasa */}
                <div
                  className="prose dark:prose-invert max-w-none whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedArticle?.content &&
                      selectedArticle.content.trim() !== ""
                        ? selectedArticle.content.includes("<") ||
                          selectedArticle.content.includes(">")
                          ? selectedArticle.content
                          : selectedArticle.content.replace(/\n/g, "<br/>")
                        : "<p class='text-gray-400 italic'>No content available.</p>",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                hubungi kami
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              kami menerima masukan, pertanyaan, atau kolaborasi menarik lainnya.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            subject: e.target.value,
                          })
                        }
                        required
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        required
                        placeholder="Your message here..."
                        rows={6}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Mail className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
