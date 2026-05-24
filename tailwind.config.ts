import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				sage: {
					DEFAULT: "#6B7C5A",
					light: "#D4DFCA",
					pale: "#F0F4EC",
				},
				warm: {
					DEFAULT: "#C4A882",
					light: "#EDE3D6",
					pale: "#FAF6F1",
				},
				earth: "#3D3328",
				mist: {
					DEFAULT: "#8C9BA8",
					pale: "#EEF1F4",
				},
				ink: "#1A1814",
				cream: "#FEFCFA",
			},
			fontFamily: {
				serif: ["Cormorant Garamond", "Georgia", "serif"],
				sans: ["DM Sans", "sans-serif"],
			},
			fontSize: {
				"display-xl": ["clamp(3.5rem, 6vw, 5.5rem)", { lineHeight: "1.05" }],
				"display-lg": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.15" }],
			},
			letterSpacing: {
				widest2: "0.16em",
				widest3: "0.18em",
			},
		},
	},
	plugins: [],
} satisfies Config;
