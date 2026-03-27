import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Moon, Sun } from "lucide-react";
import avatarMain from "@/assets/avatar-main.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import tcellLogo from "@/assets/tcell-logo.png";

const Index = () => {
  const [phone, setPhone] = useState("+992 112029992");
  const [password, setPassword] = useState("password12345");
  const [smsCode, setSmsCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(59);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const timerText = `00:${timer.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground shadow-lg"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Full-screen layout */}
      <div className="relative w-full max-w-[420px] min-h-screen sm:min-h-0 sm:h-[852px] bg-background sm:rounded-[40px] overflow-hidden sm:shadow-2xl">
        {/* Decorative purple circles */}
        <DecorativeBlob size={63} top={32} left={0} opacity={0.3} delay={0} />
        <DecorativeBlob size={83} top={32} left="39%" opacity={0.2} delay={0.5} />
        <DecorativeBlob size={70} top={100} left="58%" opacity={0.7} blur delay={1} />
        <DecorativeBlob size={60} top={385} left={44} opacity={1} delay={1.5} />
        <DecorativeBlob size={36} top={237} left={38} opacity={0.4} delay={2} />

        {/* Avatar circles with sphere animation */}
        <AvatarCircle src={avatarMain} size={183} top={69} left={46} border delay={0} />
        <AvatarCircle src={avatar2} size={99} top={237} left="51%" border delay={0.3} />
        <AvatarCircle src={avatar3} size={54} top={156} left="75%" delay={0.6} />
        <AvatarCircle src={avatar4} size={73} top={348} left={63} border delay={0.9} />
        <AvatarCircle src={avatar5} size={39} top={287} left={136} delay={1.2} />

        {/* Glass Panel */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-t-[40px]"
          style={{
            height: "calc(100% - 422px)",
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
            WebkitBackdropFilter: "var(--glass-blur)",
            boxShadow: "0px -4px 30px 0px rgba(130, 30, 190, 0.08)",
          }}
        />

        {/* Form Content */}
        <div className="absolute left-8 right-8 sm:left-10 sm:right-10 top-[449px] flex flex-col gap-4">
          {/* Phone Input */}
          <InputField label="Ваш номер">
            <div className="flex items-center gap-3 px-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 h-11 bg-transparent text-foreground text-sm tracking-tight outline-none"
              />
              <img src={tcellLogo} alt="Tcell" className="h-4 object-contain" />
              <ClearButton onClick={() => setPhone("")} />
            </div>
          </InputField>

          {/* Password Input */}
          <InputField label="Пароль">
            <div className="flex items-center gap-3 px-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 h-11 bg-transparent text-foreground text-sm tracking-tight outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <ClearButton onClick={() => setPassword("")} />
            </div>
          </InputField>

          {/* SMS Code Input */}
          <InputField label="SMS Код">
            <div className="flex items-center gap-3 px-3">
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Введите код"
                className="flex-1 h-11 bg-transparent text-foreground text-sm tracking-tight outline-none placeholder:text-[hsl(var(--placeholder-color))]"
              />
              <div className="flex items-center justify-center h-[21px] px-2 rounded-[10.5px] bg-[hsl(var(--timer-bg))] text-[hsl(var(--timer-text))] text-sm whitespace-nowrap">
                {timerText}
              </div>
            </div>
          </InputField>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              className="w-full h-11 rounded-[9px] text-primary-foreground text-base tracking-tight flex items-center justify-center font-medium transition-transform active:scale-[0.98]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Продолжить
            </button>
          </div>

          {/* Register Button */}
          <button className="w-full h-11 rounded-[9px] bg-transparent text-foreground text-base tracking-tight flex items-center justify-center -mt-2">
            Регистрация
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Animated Avatar Circle ── */
const AvatarCircle = ({
  src, size, top, left, border, delay = 0,
}: {
  src: string; size: number; top: number; left: number | string; border?: boolean; delay?: number;
}) => (
  <div
    className="absolute rounded-full overflow-hidden animate-sphere"
    style={{
      width: size, height: size, top, left,
      border: border ? "3px solid hsl(var(--primary))" : "none",
      animationDelay: `${delay}s`,
      boxShadow: border
        ? "0 8px 32px rgba(130, 30, 190, 0.3), inset 0 -4px 12px rgba(0,0,0,0.15), inset 0 4px 12px rgba(255,255,255,0.2)"
        : "0 4px 16px rgba(130, 30, 190, 0.15), inset 0 -3px 8px rgba(0,0,0,0.1), inset 0 3px 8px rgba(255,255,255,0.15)",
    }}
  >
    <img src={src} alt="" className="w-full h-full object-cover" />
    {/* Sphere highlight overlay */}
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 60% 40% at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 70%)",
      }}
    />
  </div>
);

/* ── Decorative Blob ── */
const DecorativeBlob = ({
  size, top, left, opacity, blur, delay = 0,
}: {
  size: number; top: number; left: number | string; opacity: number; blur?: boolean; delay?: number;
}) => (
  <div
    className="absolute rounded-full bg-primary animate-sphere"
    style={{
      width: size, height: size, top, left, opacity,
      filter: blur ? "blur(20px)" : "none",
      animationDelay: `${delay}s`,
    }}
  />
);

/* ── Input Field ── */
const InputField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative h-[62px]">
    <span className="absolute -top-[3px] left-0 text-sm tracking-tight text-foreground">
      {label}
    </span>
    <div className="absolute top-[18px] left-0 right-0 h-11 rounded-[22px] border border-border bg-[hsl(var(--phone-bg))]">
      {children}
    </div>
  </div>
);

/* ── Clear Button ── */
const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
    <div className="absolute inset-0 rounded-full bg-[hsl(var(--clear-btn-bg))]/20" />
    <X size={12} className="text-foreground relative z-10" />
  </button>
);

export default Index;
