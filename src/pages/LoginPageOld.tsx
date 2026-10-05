import { useState, type ReactNode, type FormEvent } from "react";
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
  background: "#080000",
  textMuted: "rgba(255, 255, 255, 0.4)",
  border: "rgba(255, 255, 255, 0.12)",
  // Added for the light-glass login card — everything inside the card
  // now reads as dark text on a translucent white panel.
  textDark: "#1E2A32",
  textMutedDark: "rgba(26, 26, 46, 0.55)",
};

const FEATURES = [
  "Real-Time Tracking",
  "Cargo Management",
  "Fleet Operations",
];

const NODES = [
  { x: 15, y: 12 },
  { x: 35, y: 28 },
  { x: 55, y: 10 },
  { x: 72, y: 30 },
  { x: 88, y: 15 },
  { x: 25, y: 50 },
  { x: 50, y: 45 },
  { x: 78, y: 52 },
  { x: 10, y: 70 },
  { x: 40, y: 68 },
  { x: 62, y: 72 },
  { x: 90, y: 65 },
  { x: 20, y: 88 },
  { x: 48, y: 85 },
  { x: 75, y: 90 },
  { x: 95, y: 80 },
  { x: 5, y: 40 },
  { x: 65, y: 32 },
  { x: 83, y: 78 },
  { x: 30, y: 35 },
];

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 4],
  [1, 5],
  [2, 6],
  [3, 6],
  [3, 7],
  [4, 7],
  [5, 9],
  [6, 9],
  [6, 10],
  [7, 10],
  [7, 11],
  [8, 9],
  [9, 13],
  [10, 13],
  [10, 14],
  [11, 15],
  [8, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [0, 16],
  [5, 16],
  [16, 8],
  [1, 19],
  [6, 17],
  [17, 7],
  [11, 18],
  [15, 18],
];

/* -------------------------------------------------------------------------- */
/* Shared Styles                                                              */
/* -------------------------------------------------------------------------- */

// Light frosted-glass inputs: translucent WHITE background, dark text,
// so the field reads clearly against the light glass card.
const inputStyles = {
  // Reset the TextField root background (theme sets #f6f9fcff globally)
  backgroundColor: "transparent !important",

  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent !important",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: COLORS.white,
    transition: "box-shadow 0.2s ease",

    "& input": {
      backgroundColor: "transparent !important",
      color: COLORS.white,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },

    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(198, 40, 40, 0.6)",
      },
    },

    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(198, 40, 40, 0.18)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        borderWidth: "1.5px",
      },
    },
  },

  // Label — clearly visible on the dark card
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.55)",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORS.primaryLight,
  },

  // Icons visible against dark background
  "& .MuiInputAdornment-root": {
    "& .MuiSvgIcon-root": {
      color: "rgba(255, 255, 255, 0.65)",
      fontSize: "1.2rem",
    },
  },

  // Autofill — keep dark inset to match the dark card
  "& .MuiOutlinedInput-root input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px #180000 inset !important",
    WebkitTextFillColor: "#ffffff !important",
    caretColor: "#ffffff",
    borderRadius: "inherit",
    transition: "background-color 9999s ease-in-out 0s",
  },

  "& .MuiOutlinedInput-root input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 1000px #180000 inset !important",
    WebkitTextFillColor: "#ffffff !important",
  },

  "& .MuiOutlinedInput-root input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px #180000 inset !important",
    WebkitTextFillColor: "#ffffff !important",
  },

  "& .MuiOutlinedInput-root input:-webkit-autofill:active": {
    WebkitBoxShadow: "0 0 0 1000px #180000 inset !important",
    WebkitTextFillColor: "#ffffff !important",
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

  boxShadow: "0 4px 20px rgba(198, 40, 40, 0.45)",

  "&:hover": {
    background: `linear-gradient(
      135deg,
      ${COLORS.primaryLight} 0%,
      ${COLORS.primary} 100%
    )`,
    boxShadow: "0 6px 28px rgba(198, 40, 40, 0.6)",
    transform: "translateY(-1px)",
  },

  transition: "all 0.2s ease",
};

/* -------------------------------------------------------------------------- */
/* Auth Layout                                                                */
/* -------------------------------------------------------------------------- */

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minHeight: "100dvh",
        display: "flex",
        overflow: "hidden",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Background Network                                                         */
/* -------------------------------------------------------------------------- */

function NetworkBackground() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient
            id="networkGradient"
            cx="30%"
            cy="20%"
            r="65%"
          >
            <stop
              offset="0%"
              stopColor={COLORS.primary}
              stopOpacity="0.22"
            />

            <stop
              offset="100%"
              stopColor="#000000"
              stopOpacity="0"
            />
          </radialGradient>

          <filter id="nodeGlow">
            <feGaussianBlur
              stdDeviation="0.9"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          width="100"
          height="100"
          fill="url(#networkGradient)"
        />

        {/* Horizontal grid */}
        {Array.from({ length: 11 }, (_, index) => (
          <line
            key={`horizontal-${index}`}
            x1="0"
            y1={index * 10}
            x2="100"
            y2={index * 10}
            stroke="#ff2222"
            strokeWidth="0.08"
            strokeOpacity="0.1"
          />
        ))}

        {/* Vertical grid */}
        {Array.from({ length: 11 }, (_, index) => (
          <line
            key={`vertical-${index}`}
            x1={index * 10}
            y1="0"
            x2={index * 10}
            y2="100"
            stroke="#ff2222"
            strokeWidth="0.08"
            strokeOpacity="0.1"
          />
        ))}

        {/* Network connections */}
        {EDGES.map(([start, end], index) => (
          <line
            key={`edge-${index}`}
            x1={NODES[start].x}
            y1={NODES[start].y}
            x2={NODES[end].x}
            y2={NODES[end].y}
            stroke="#ff4444"
            strokeWidth="0.2" 
            strokeOpacity="0.38"
          />
        ))}

        {/* Network nodes */}
        {NODES.map((node, index) => (
          <g
            key={`node-${index}`}
            filter="url(#nodeGlow)"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={index % 5 === 0 ? 0.9 : 0.55}
              fill="#ff7070"
              fillOpacity="0.9"
            />

            {index % 5 === 0 && (
              <circle
                cx={node.x}
                cy={node.y}
                r={1.6}
                fill="none"
                stroke="#ff4444"
                strokeWidth="0.2"
                strokeOpacity="0.45"
              />
            )}
          </g>
        ))}
      </svg>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Decorative Orbit                                                           */
/* -------------------------------------------------------------------------- */

function Orbit({
  size,
  position,
  duration,
  reverse = false,
}: {
  size: number;
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  duration: number;
  reverse?: boolean;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        ...position,
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid rgba(198, 40, 40, 0.18)",

        animation: `spin ${duration}s linear infinite ${reverse ? "reverse" : ""
          }`,

        "@keyframes spin": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "48%",
          left: "-5%",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: COLORS.primary,
          boxShadow: `0 0 14px ${COLORS.primary}`,
        }}
      />
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Brand Panel                                                                */
/* -------------------------------------------------------------------------- */

function BrandPanel() {
  return (
    <Box
      sx={{
        width: "108%",
        height: "100%",
        position: "relative",
        overflow: "hidden",

        background:
          "radial-gradient(ellipse at 30% 20%, #2a0505 0%, #120000 50%, #050000 100%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NetworkBackground />

      <Orbit
        size={200}
        duration={28}
        position={{
          top: "6%",
          right: "6%",
        }}
      />

      <Orbit
        size={130}
        duration={20}
        reverse
        position={{
          bottom: "10%",
          left: "5%",
        }}
      />

      {/* Brand content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          px: 4,
        }}
      >
        {/* Brand icon */}
        <Box
          sx={{
            position: "relative",
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              transform: "rotate(45deg)",
              border: `2px solid ${COLORS.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(198, 40, 40, 0.07)",
              boxShadow:
                "0 0 32px rgba(198, 40, 40, 0.45), inset 0 0 18px rgba(198, 40, 40, 0.1)",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: COLORS.primaryLight,
                boxShadow: `0 0 12px ${COLORS.primaryLight}`,
              }}
            />
          </Box>
        </Box>

        {/* Brand name */}
        <Typography
          component="p"
          sx={{
            m: 0,
            color: COLORS.white,
            fontWeight: 800,
            fontSize: "2rem",
            lineHeight: 1.1,
            letterSpacing: "-1px",
            textShadow: "0 0 40px rgba(198, 40, 40, 0.55)",
          }}
        >
          TTS
        </Typography>

        {/* Portal title */}
        <Typography
          component="p"
          sx={{
            m: 0,
            color: COLORS.primaryLight,
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Operations Portal
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
            maxWidth: 240,
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(198, 40, 40, 0.3)",
            }}
          />

          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: COLORS.primary,
            }}
          />

          <Box
            sx={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(198, 40, 40, 0.3)",
            }}
          />
        </Box>

        {/* Features */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {FEATURES.map((feature) => (
            <Box
              key={feature}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                opacity: 0.72,
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  flexShrink: 0,
                  borderRadius: "50%",
                  backgroundColor: COLORS.primaryLight,
                  boxShadow: `0 0 6px ${COLORS.primaryLight}`,
                }}
              />

              <Typography
                component="span"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.5px",
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Login Form                                                                 */
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
  return (
    <AuthLayout>
      {/* ------------------------------------------------------------------ */}
      {/* Left: Login                                                         */}
      {/* ------------------------------------------------------------------ */}

      <Box
        sx={{
          width: {
            xs: "100%",
            md: "35%",
          },

          minHeight: {
            xs: "100dvh",
            md: "100dvh",
          },

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          px: {
            xs: 3,
            sm: 5,
            md: 6,
            lg: 8,
          },

          background:
            "linear-gradient(160deg, #0e0000 0%, #1c0000 55%, #080808 100%)",

          position: "relative",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,110,145,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Login card — dark glass that blends into the backdrop; the
            input fields inside carry their own lighter glass for contrast */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },

            borderRadius: 4,

            backgroundColor: "rgba(255, 255, 255, 0.04)",

            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",

            border: "1px solid rgba(255, 255, 255, 0.08)",

            boxShadow:
              "0 8px 40px rgba(198, 40, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",

            position: "relative",
            zIndex: 1,
          }}
        >
          <LoginForm />
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Right: Branding                                                     */}
      {/* ------------------------------------------------------------------ */}

      <Box
        sx={{
          width: "60%",
          height: "100dvh",
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <BrandPanel />
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;