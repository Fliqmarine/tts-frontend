import { useState, useEffect, type FormEvent } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ttsLogo = "/TTS_Logo.png";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const COLORS = {
  primary: "#3B6E91",
  primaryLight: "#6C93AF",
  primaryDark: "#2D536E",
  white: "#FFFFFF",
  textDark: "#1E2A32",
  textMuted: "#5A6B75",
  textMutedDark: "#5A6B75",
  border: "#DCE4E8",
};

/* -------------------------------------------------------------------------- */
/* Shared Styles — plain light card, dark text on white                       */
/* -------------------------------------------------------------------------- */

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    color: COLORS.textDark,
    transition: "box-shadow 0.2s ease",

    "& input": {
      color: COLORS.textDark,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: COLORS.border,
    },

    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(181, 88, 61, 0.5)",
      },
    },

    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(181, 88, 61, 0.12)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        borderWidth: "1.5px",
      },
    },
  },

  "& .MuiInputLabel-root": {
    color: COLORS.textMutedDark,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORS.primary,
  },

  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(26, 26, 46, 0.5)",
    fontSize: "1.2rem",
  },

  "& .MuiOutlinedInput-root input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px #ffffff inset !important",
    WebkitTextFillColor: `${COLORS.textDark} !important`,
    caretColor: COLORS.textDark,
    borderRadius: "inherit",
    transition: "background-color 9999s ease-in-out 0s",
  },
};

const loginButtonStyles = {
  py: 1.2,
  mt: 0.5,
  borderRadius: "10px",
  fontSize: "0.9rem",
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "0.5px",

  background: `linear-gradient(
    135deg,
    ${COLORS.primary} 0%,
    ${COLORS.primaryDark} 100%
  )`,

  boxShadow: "0 4px 20px rgba(181, 88, 61, 0.3)",

  "&:hover": {
    background: `linear-gradient(
      135deg,
      ${COLORS.primaryLight} 0%,
      ${COLORS.primary} 100%
    )`,
    boxShadow: "0 6px 28px rgba(181, 88, 61, 0.4)",
    transform: "translateY(-1px)",
  },

  transition: "all 0.2s ease",
};

/* -------------------------------------------------------------------------- */
/* Intro Splash — logo -> perimeter-draw outline -> 3D flip -> reveal          */
/* -------------------------------------------------------------------------- */

// Timings (ms) for the intro sequence. Kept in one place so the JS timers
// and the CSS transition durations below always agree.
const INTRO_LOGO_MS = 500; // plain logo, centered, before anything else happens
const INTRO_DRAW_MS = 1200; // gray outline traces the box perimeter
const INTRO_FLIP_MS = 1200; // 3D rotateY flip to the login-preview face
const INTRO_EXIT_MS = 100; // splash fades out, revealing the real form beneath

type IntroPhase = "logo" | "draw" | "flip" | "exit";

function IntroSplash({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("logo");

  useEffect(() => {
    const toDraw = setTimeout(() => setPhase("draw"), INTRO_LOGO_MS);
    const toFlip = setTimeout(
      () => setPhase("flip"),
      INTRO_LOGO_MS + INTRO_DRAW_MS
    );
    const toExit = setTimeout(
      () => setPhase("exit"),
      INTRO_LOGO_MS + INTRO_DRAW_MS + INTRO_FLIP_MS
    );
    const toFinish = setTimeout(
      onFinish,
      INTRO_LOGO_MS + INTRO_DRAW_MS + INTRO_FLIP_MS + INTRO_EXIT_MS
    );

    return () => {
      clearTimeout(toDraw);
      clearTimeout(toFlip);
      clearTimeout(toExit);
      clearTimeout(toFinish);
    };
  }, [onFinish]);

  const isDrawing = phase !== "logo";
  const isFlipped = phase === "flip" || phase === "exit";

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
         background:
            "linear-gradient(160deg, #4FA8A0 0%, #3D817B 55%, #1E2A32 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "exit" ? 0 : 1,
        transition: `opacity ${INTRO_EXIT_MS}ms ease`,
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Step 1: plain centered logo */}
      <Box
        component="img"
        src={ttsLogo}
        alt="TTS"
        sx={{
          position: "absolute",
          height: 56,
          width: "auto",
          opacity: phase === "logo" ? 1 : 0,
          transform: phase === "logo" ? "scale(1)" : "scale(0.85)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      />

      {/* Step 2 + 3: outline draw, then flip to the login preview */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          perspective: "900px",
          opacity: phase === "logo" ? 0 : 1,
          transition: "opacity 250ms ease",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: `transform ${INTRO_FLIP_MS}ms cubic-bezier(.6,.05,.25,1)`,
          }}
        >
          {/* Front face: the box outline, drawn clockwise from the top-left
              corner (matches an SVG rect's default path direction) with a
              bright "comet" tracing just ahead of the gray line. */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 230 230">
              <rect
                x="2"
                y="2"
                width="226"
                height="226"
                rx="16"
                fill="none"
                stroke="#b7bec9"
                strokeWidth="1.5"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={isDrawing ? 0 : 100}
                style={{ transition: `stroke-dashoffset ${INTRO_DRAW_MS}ms ease` }}
              />
              <rect
                x="2"
                y="2"
                width="226"
                height="226"
                rx="16"
                fill="none"
                stroke={COLORS.primaryLight}
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="6 94"
                strokeDashoffset={isDrawing ? 0 : 100}
                style={{
                  transition: `stroke-dashoffset ${INTRO_DRAW_MS}ms ease`,
                  filter: `drop-shadow(0 0 4px ${COLORS.primaryLight})`,
                }}
              />
            </svg>
          </Box>

          {/* Back face: a compact preview of the real sign-in fields,
              icons included, revealed once the box has flipped. */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.1,
              px: 3,
            }}
          >
            <Box
              component="img"
              src={ttsLogo}
              alt="TTS"
              sx={{ height: 24, mb: 0.5 }}
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                px: 1.1,
                py: 0.7,
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                Email
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                px: 1.1,
                py: 0.7,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              <Typography
                sx={{ fontSize: "0.72rem", color: "#9ca3af", flex: 1 }}
              >
                Password
              </Typography>
              <VisibilityOutlinedIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
            </Box>

            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                mt: 0.5,
                py: 0.8,
                borderRadius: "8px",
                backgroundColor: COLORS.primary,
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              Sign In
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Login Form — the real, functional form shown once the intro finishes       */
/* -------------------------------------------------------------------------- */

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    // TODO:
    // Replace this temporary login logic
    // with the real authentication API.

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 900);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Logo — card is dark-glass again, so back to the light/inverted mark */}
      <Box
        component="img"
        src={ttsLogo}
        alt="TTS Logo"
        sx={{
          height: 36,
          width: "auto",
          maxWidth: 120,
          objectFit: "contain",
          objectPosition: "left",
          filter: "brightness(0) invert(1)",
          opacity: 0.9,
        }}
      />

      {/* Heading */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            color: COLORS.white,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            fontSize: {
              xs: "1.4rem",
              md: "1.6rem",
            },
            mb: 0.25,
          }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            color: COLORS.textMuted,
            fontSize: "0.85rem",
          }}
        >
          Sign in to your operations console
        </Typography>
      </Box>

      {/* Accent line */}
      <Box
        sx={{
          width: 40,
          height: 3,
          borderRadius: 2,
          backgroundColor: COLORS.primary,
        }}
      />

      {/* Email */}
      <TextField
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
        size="small"
        autoComplete="email"
        sx={inputStyles}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Password */}
      <TextField
        name="password"
        label="Password"
        type={isPasswordVisible ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        fullWidth
        size="small"
        autoComplete="current-password"
        sx={inputStyles}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  type="button"
                  onClick={() => setIsPasswordVisible((previous) => !previous)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  sx={{
                    color: "rgba(26, 26, 46, 0.55)",
                    "&:hover": {
                      color: COLORS.primary,
                      backgroundColor: "rgba(198, 40, 40, 0.08)",
                    },
                    "&:active": {
                      color: COLORS.primaryDark,
                    },
                  }}
                >
                  {isPasswordVisible ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={loginButtonStyles}
      >
        {isSubmitting ? (
          <CircularProgress
            size={20}
            sx={{
              color: COLORS.white,
            }}
          />
        ) : (
          "Sign In"
        )}
      </Button>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Login Page                                                                 */
/* -------------------------------------------------------------------------- */

function LoginPage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroSplash onFinish={() => setIntroDone(true)} />}

      {introDone && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100dvh",
            background:
            "linear-gradient(160deg, #4FA8A0 0%, #3D817B 55%, #1E2A32 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              p: {
                xs: 3,
                sm: 4,
              },
              borderRadius: 4,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.06)",
            }}
          >
            <LoginForm />
          </Box>
        </Box>
      )}
    </>
  );
}

export default LoginPage;