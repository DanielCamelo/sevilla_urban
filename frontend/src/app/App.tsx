import { useState, useRef } from "react";
import {
  X, MessageCircle, ChevronLeft, ChevronRight,
  CheckCircle2, Send, Phone, Mail, Building2,
  MapPin, User, AlignLeft, Instagram, Facebook, Youtube,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import productsData from "../data/products.json";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  category: "zapatos" | "gorras";
  gender?: "hombre" | "mujer" | "niños";
  sizes: string[];
  images: string[];
  description: string;
  inStock: boolean;
  badge?: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = productsData as Product[];

const WA_NUMBER = "573000000000";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const FALLBACK_IMAGE = "/Adidas Ultrabounce_120.jpg";

const SOCIALS = [
  { name: "Instagram", url: "https://instagram.com/sevillaurban", icon: "instagram" as const },
  { name: "TikTok", url: "https://tiktok.com/@sevillaurban", icon: "tiktok" as const },
  { name: "Facebook", url: "https://facebook.com/sevillaurban", icon: "facebook" as const },
];

const SHOE_GENDERS = ["hombre", "mujer", "niños"] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}

function waLink(product: Product, size: string | null) {
  const msg = size
    ? `Hola! Me interesa: *${product.name}* – talla *${size}*. ¿Está disponible?`
    : `Hola! Me interesa: *${product.name}*. ¿Está disponible?`;
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.89a8.18 8.18 0 004.78 1.52V7a4.85 4.85 0 01-1.01-.31z" />
    </svg>
  );
}

function SocialIcon({ icon, className }: { icon: typeof SOCIALS[0]["icon"]; className?: string }) {
  if (icon === "tiktok") return <TikTokIcon className={className} />;
  if (icon === "instagram") return <Instagram className={className} />;
  if (icon === "facebook") return <Facebook className={className} />;
  return <Youtube className={className} />;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-[#1A1A1F] border border-white/5 hover:border-[#3DCBFF]/40 transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square bg-[#0A0A0C] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white text-xs font-black tracking-[0.25em] border border-white/40 px-3 py-1.5">
              AGOTADO
            </span>
          </div>
        )}
        {product.badge && product.inStock && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-black tracking-widest px-2 py-1 ${
              product.badge === "NUEVO"
                ? "bg-[#3DCBFF] text-[#0A0A0C]"
                : product.badge === "CLÁSICO"
                ? "bg-[#E8332E] text-white"
                : "bg-white text-[#0A0A0C]"
            }`}
          >
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-xs font-black tracking-[0.2em] border border-white/50 px-4 py-2 bg-black/40 backdrop-blur-sm">
            VER DETALLE
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[#A8A8B0] text-[10px] tracking-[0.25em] mb-1 uppercase">
          {product.category === "zapatos" ? "Calzado" : "Gorra"}
        </p>
        <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-2 font-[Rajdhani]">
          {product.name}
        </h3>
        <p className="text-[#E8332E] font-black text-base tracking-wide">{formatPrice(product.price)}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.slice(0, 5).map((size) => (
            <span key={size} className="text-[10px] text-[#A8A8B0] border border-white/10 px-1.5 py-0.5">
              {size}
            </span>
          ))}
          {product.sizes.length > 5 && (
            <span className="text-[10px] text-[#3DCBFF]">+{product.sizes.length - 5}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  icon,
  name,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
}: {
  icon: React.ReactNode;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A8B0] pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#1A1A1F] border border-white/10 text-white placeholder-[#A8A8B0]/40 text-sm pl-11 pr-4 py-4 focus:outline-none focus:border-[#3DCBFF]/60 transition-colors"
      />
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [category, setCategory] = useState<"todos" | "zapatos" | "gorras">("todos");
  const [activeGender, setActiveGender] = useState<typeof SHOE_GENDERS[number] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    ciudad: "",
    telefono: "",
    correo: "",
    mensaje: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const catalogRef = useRef<HTMLDivElement>(null);

  const filtered = PRODUCTS.filter((p) => {
    if (category !== "todos" && p.category !== category) return false;
    if (activeGender && p.gender !== activeGender) return false;
    return true;
  });

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setModalImageIndex(0);
    setSelectedSize(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("sent");
      setFormData({ nombre: "", empresa: "", ciudad: "", telefono: "", correo: "", mensaje: "" });
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden font-[DM_Sans]">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-white/5">
        <a href="#" className="font-[Rajdhani] text-xl tracking-[0.2em] font-bold">
          SEVILLA <span className="text-[#3DCBFF]">URBAN</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-xs text-[#A8A8B0] tracking-[0.2em]">
          <a href="#catalogo" className="hover:text-white transition-colors">CATÁLOGO</a>
          <a href="#social" className="hover:text-white transition-colors">REDES</a>
          <a href="#mayoristas" className="hover:text-white transition-colors">MAYORISTAS</a>
        </div>
        <a
          href={WA_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-[#3DCBFF] border border-[#3DCBFF]/40 px-4 py-2 hover:bg-[#3DCBFF]/10 transition-colors tracking-[0.15em]"
        >
          <MessageCircle size={15} />
          <span className="hidden md:inline">CONTACTAR</span>
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/hero.jpg"
            alt="Sevilla Urban hero"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/50 via-[#0A0A0C]/30 to-[#0A0A0C]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/70 via-transparent to-[#0A0A0C]/70" />
        </div>

        {/* horizontal accent lines */}
        <div className="absolute top-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8332E]/25 to-transparent" />
        <div className="absolute top-[42%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3DCBFF]/15 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 border border-[#3DCBFF]/25 bg-[#3DCBFF]/5 text-[#3DCBFF] text-[10px] tracking-[0.4em] uppercase">
            <span className="w-1.5 h-1.5 bg-[#3DCBFF] rounded-full animate-pulse" />
            Colección 2025
            <span className="w-1.5 h-1.5 bg-[#3DCBFF] rounded-full animate-pulse" />
          </div>

          <h1 className="font-[Rajdhani] text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tight leading-[0.9] mb-8">
            <span className="text-white">STREET</span>
            <br />
            <span className="text-[#E8332E]">STYLE</span>
            <span className="text-[#3DCBFF]">.</span>
          </h1>

          <p className="text-[#A8A8B0] text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed">
            Zapatos y gorras para quienes definen la calle.
            <br />
            Auténtico. Urbano. Sin filtro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#3DCBFF] text-[#0A0A0C] font-[Rajdhani] font-black text-sm tracking-[0.25em] px-10 py-4 hover:bg-white transition-colors uppercase"
            >
              Ver Catálogo
            </button>
            <a
              href={WA_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white font-[Rajdhani] font-bold text-sm tracking-[0.25em] px-10 py-4 hover:border-white/60 hover:bg-white/5 transition-colors uppercase"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A8A8B0]/40 text-[10px] tracking-[0.4em]">
          <span>SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#A8A8B0]/40 to-transparent" />
        </div>
      </section>

      {/* ── Catalog ── */}
      <section id="catalogo" ref={catalogRef} className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[#3DCBFF] text-[10px] tracking-[0.4em] uppercase mb-2">— Colección</p>
              <h2 className="font-[Rajdhani] text-5xl md:text-6xl font-black tracking-tight">CATÁLOGO</h2>
            </div>
            <p className="text-[#A8A8B0] text-sm hidden md:block">{filtered.length} productos</p>
          </div>

          {/* Filters */}
          <div className="mb-12 space-y-5">
            {/* Category toggle */}
            <div className="flex">
              <div className="flex items-center bg-[#1A1A1F] border border-white/5 p-1 gap-1">
                {(["todos", "zapatos", "gorras"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setActiveGender(null); }}
                    className={`px-6 py-2.5 text-[11px] font-black tracking-[0.2em] uppercase transition-colors ${
                      category === cat
                        ? "bg-[#3DCBFF] text-[#0A0A0C]"
                        : "text-[#A8A8B0] hover:text-white"
                    }`}
                  >
                    {cat === "todos" ? "Todos" : cat === "zapatos" ? "Zapatos" : "Gorras"}
                  </button>
                ))}
              </div>
            </div>

            {/* Shoe gender filters */}
            {category !== "gorras" && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[#A8A8B0] text-[10px] tracking-[0.3em] mr-1 uppercase">Género:</span>
              <button
                onClick={() => setActiveGender(null)}
                className={`px-3 py-1.5 text-[11px] tracking-wider border transition-colors ${
                  activeGender === null
                    ? "border-[#3DCBFF] text-[#3DCBFF] bg-[#3DCBFF]/5"
                    : "border-white/10 text-[#A8A8B0] hover:border-white/30"
                }`}
              >
                Todos
              </button>
              {SHOE_GENDERS.map((gender) => {
                const hasStock = PRODUCTS.some(
                  (p) =>
                    (category === "todos" || p.category === "zapatos") &&
                    p.gender === gender &&
                    p.inStock
                );
                return (
                  <button
                    key={gender}
                    onClick={() => setActiveGender(activeGender === gender ? null : gender)}
                    disabled={!hasStock}
                    className={`px-3 py-1.5 text-[11px] tracking-wider border transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
                      activeGender === gender
                        ? "border-[#3DCBFF] text-[#3DCBFF] bg-[#3DCBFF]/5"
                        : "border-white/10 text-[#A8A8B0] hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {gender === "niños" ? "Niños" : gender[0].toUpperCase() + gender.slice(1)}
                  </button>
                );
              })}
            </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => openProduct(product)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-24 text-center text-[#A8A8B0]">
              <p className="text-lg mb-4">No hay productos con ese filtro.</p>
              <button
                onClick={() => { setCategory("todos"); setActiveGender(null); }}
                className="text-[#3DCBFF] text-sm hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Product Modal ── */}
      <Dialog.Root open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            aria-describedby={undefined}
          >
            {selectedProduct && (
              <div className="bg-[#1A1A1F] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                <Dialog.Title className="sr-only">{selectedProduct.name}</Dialog.Title>
                <Dialog.Close className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-[#A8A8B0] hover:text-white transition-colors bg-[#0A0A0C]/60 hover:bg-[#0A0A0C]">
                  <X size={18} />
                </Dialog.Close>

                <div className="grid md:grid-cols-2">
                  {/* Gallery */}
                  <div className="relative aspect-square bg-[#0A0A0C]">
                    <img
                      src={selectedProduct.images[modalImageIndex]}
                      alt={selectedProduct.name}
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    {!selectedProduct.inStock && (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                        <span className="text-white font-[Rajdhani] font-black text-3xl tracking-[0.2em] border-2 border-white/50 px-8 py-3">
                          AGOTADO
                        </span>
                      </div>
                    )}
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setModalImageIndex((i) => (i - 1 + selectedProduct.images.length) % selectedProduct.images.length)
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setModalImageIndex((i) => (i + 1) % selectedProduct.images.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedProduct.images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setModalImageIndex(i)}
                              className={`w-2 h-2 transition-colors ${
                                i === modalImageIndex ? "bg-[#3DCBFF]" : "bg-white/25 hover:bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 md:p-8 flex flex-col gap-5">
                    <div>
                      <p className="text-[#3DCBFF] text-[10px] tracking-[0.35em] uppercase mb-1">
                        {selectedProduct.category === "zapatos" ? "Calzado" : "Gorra"}
                      </p>
                      <h3 className="font-[Rajdhani] text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-[#E8332E] text-2xl font-black mt-3 tracking-wide">
                        {formatPrice(selectedProduct.price)}
                      </p>
                    </div>

                    <p className="text-[#A8A8B0] text-sm leading-relaxed">{selectedProduct.description}</p>

                    {/* Size selector */}
                    <div>
                      <p className="text-[10px] tracking-[0.3em] text-[#A8A8B0] uppercase mb-3">
                        Seleccionar Talla
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            disabled={!selectedProduct.inStock}
                            onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                            className={`px-4 py-2 text-sm font-bold tracking-wider border-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                              selectedSize === size
                                ? "border-[#3DCBFF] bg-[#3DCBFF]/10 text-[#3DCBFF]"
                                : "border-white/20 text-white hover:border-white/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    {selectedProduct.inStock ? (
                      <a
                        href={waLink(selectedProduct, selectedSize)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-[Rajdhani] font-black text-sm tracking-[0.2em] py-4 hover:bg-[#1fb558] transition-colors uppercase"
                      >
                        <MessageCircle size={18} />
                        {selectedSize ? `Consultar Talla ${selectedSize}` : "Consultar por WhatsApp"}
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-3 bg-white/5 text-[#A8A8B0] font-[Rajdhani] font-black text-sm tracking-[0.2em] py-4 uppercase cursor-not-allowed border border-white/5">
                        Producto Agotado
                      </div>
                    )}

                    <p className="text-[#A8A8B0]/40 text-[11px] text-center leading-relaxed">
                      {selectedSize
                        ? `Consultarás: ${selectedProduct.name} – Talla ${selectedSize}`
                        : "Selecciona una talla para incluirla en tu mensaje"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Social ── */}
      <section id="social" className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#3DCBFF] text-[10px] tracking-[0.4em] uppercase mb-2">— Síguenos</p>
            <h2 className="font-[Rajdhani] text-5xl md:text-6xl font-black tracking-tight">REDES SOCIALES</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-4 py-12 border border-white/8 hover:border-[#3DCBFF]/50 hover:bg-[#3DCBFF]/5 transition-all duration-300"
              >
                <SocialIcon
                  icon={social.icon}
                  className="w-8 h-8 text-[#A8A8B0] group-hover:text-[#3DCBFF] transition-colors"
                />
                <span className="text-[10px] tracking-[0.3em] text-[#A8A8B0] group-hover:text-white transition-colors uppercase">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wholesale Form ── */}
      <section id="mayoristas" className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E8332E] text-[10px] tracking-[0.4em] uppercase mb-2">— Exclusivo</p>
            <h2 className="font-[Rajdhani] text-5xl md:text-6xl font-black tracking-tight">MAYORISTAS</h2>
            <p className="text-[#A8A8B0] mt-5 max-w-md mx-auto text-sm leading-relaxed">
              ¿Tienes un negocio y quieres manejar nuestras referencias?
              Llena el formulario y te contactamos.
            </p>
          </div>

          {formStatus === "sent" ? (
            <div className="text-center py-20 border border-[#25D366]/25 bg-[#25D366]/5">
              <CheckCircle2 size={52} className="text-[#25D366] mx-auto mb-5" />
              <h3 className="font-[Rajdhani] text-3xl font-black mb-2">¡Mensaje Enviado!</h3>
              <p className="text-[#A8A8B0] text-sm">Nos pondremos en contacto contigo pronto.</p>
              <button
                onClick={() => setFormStatus("idle")}
                className="mt-6 text-[#3DCBFF] text-sm hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  icon={<User size={15} />}
                  name="nombre"
                  placeholder="Nombre completo *"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  required
                />
                <FormField
                  icon={<Building2 size={15} />}
                  name="empresa"
                  placeholder="Nombre del negocio"
                  value={formData.empresa}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  icon={<MapPin size={15} />}
                  name="ciudad"
                  placeholder="Ciudad *"
                  value={formData.ciudad}
                  onChange={handleFormChange}
                  required
                />
                <FormField
                  icon={<Phone size={15} />}
                  name="telefono"
                  placeholder="Teléfono *"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <FormField
                icon={<Mail size={15} />}
                name="correo"
                placeholder="Correo electrónico *"
                type="email"
                value={formData.correo}
                onChange={handleFormChange}
                required
              />
              <div className="relative">
                <span className="absolute left-4 top-4 text-[#A8A8B0] pointer-events-none">
                  <AlignLeft size={15} />
                </span>
                <textarea
                  name="mensaje"
                  placeholder="¿En qué podemos ayudarte? Cuéntanos sobre tu negocio... *"
                  value={formData.mensaje}
                  onChange={handleFormChange}
                  required
                  rows={5}
                  className="w-full bg-[#1A1A1F] border border-white/10 text-white placeholder-[#A8A8B0]/40 text-sm pl-11 pr-4 py-4 resize-none focus:outline-none focus:border-[#3DCBFF]/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full flex items-center justify-center gap-3 bg-[#E8332E] text-white font-[Rajdhani] font-black text-sm tracking-[0.2em] py-5 hover:bg-[#cc2b27] transition-colors uppercase disabled:opacity-60"
              >
                {formStatus === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Enviar Solicitud
                  </>
                )}
              </button>
              <p className="text-[#A8A8B0]/40 text-[11px] text-center">
                Al enviar, aceptas que nos comuniquemos contigo para gestionar tu solicitud mayorista.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <span className="font-[Rajdhani] text-xl tracking-[0.2em] font-bold">
            SEVILLA <span className="text-[#3DCBFF]">URBAN</span>
          </span>
          <p className="text-[#A8A8B0]/40 text-xs tracking-wider">
            © 2025 Sevilla Urban. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A8A8B0]/40 hover:text-[#3DCBFF] transition-colors"
                aria-label={s.name}
              >
                <SocialIcon icon={s.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ── */}
      <a
        href={WA_BASE}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_50px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </a>
    </div>
  );
}
