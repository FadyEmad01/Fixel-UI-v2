import { ImageResponse } from "next/og";

import { site } from "@/lib/site";
import illustrationMetadata from "../generated/metadata.json";
import { ILLUSTRATION_CATEGORIES } from "./categories";

const size = { width: 1200, height: 630 };

type IllustrationSummary = {
  slug: string;
  title: string;
  description: string;
  hidden: boolean;
};

const summaries = illustrationMetadata.items as IllustrationSummary[];

function brandMark() {
  return (
    <div
      style={{
        position: "relative",
        width: 32,
        height: 48,
        display: "flex",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 18,
          height: 14,
          backgroundColor: "#004BFF",
          borderRadius: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          width: 18,
          height: 14,
          backgroundColor: "#004BFF",
          borderRadius: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 0,
          width: 18,
          height: 14,
          backgroundColor: "#004BFF",
          borderRadius: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 18,
          height: 14,
          backgroundColor: "#004BFF",
          borderRadius: 5,
        }}
      />
    </div>
  );
}

function PreviewCard() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: 430,
        padding: 20,
        border: "1px solid #DDE1E9",
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 20px 55px rgba(22, 31, 54, 0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: "#FF7568",
          }}
        />
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: "#F4C44E",
          }}
        />
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: "#54C58B",
          }}
        />
        <div
          style={{
            display: "flex",
            marginLeft: 12,
            width: 260,
            height: 23,
            borderRadius: 12,
            backgroundColor: "#F1F2F5",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 21,
          padding: 22,
          border: "1px solid #E7E9EE",
          borderRadius: 15,
          backgroundColor: "#F8F9FB",
        }}
      >
        <div
          style={{
            width: 152,
            height: 11,
            borderRadius: 6,
            backgroundColor: "#414652",
          }}
        />
        <div
          style={{
            width: 238,
            height: 7,
            marginTop: 12,
            borderRadius: 4,
            backgroundColor: "#BEC3CD",
          }}
        />
        <div
          style={{
            width: 180,
            height: 7,
            marginTop: 7,
            borderRadius: 4,
            backgroundColor: "#D5D8DF",
          }}
        />
        <div
          style={{
            height: 1,
            marginTop: 21,
            marginBottom: 19,
            backgroundColor: "#E2E5EB",
          }}
        />

        <div style={{ display: "flex", gap: 12 }}>
          {["#E7EDFF", "#EAF5EF", "#FFF1E3"].map((color, index) => (
            <div
              key={color}
              style={{
                display: "flex",
                flexDirection: "column",
                width: 105,
                height: 120,
                padding: 12,
                border: "1px solid #E5E8EE",
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: color,
                  color:
                    index === 0
                      ? "#004BFF"
                      : index === 1
                        ? "#42A775"
                        : "#ECA44A",
                  fontSize: 20,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {index === 0 ? "+" : index === 1 ? "✓" : "·"}
              </div>
              <div
                style={{
                  width: 72,
                  height: 6,
                  marginTop: 17,
                  borderRadius: 4,
                  backgroundColor: "#8D929D",
                }}
              />
              <div
                style={{
                  width: 52,
                  height: 5,
                  marginTop: 8,
                  borderRadius: 4,
                  backgroundColor: "#D2D5DC",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 17,
        }}
      >
        <div
          style={{
            width: 110,
            height: 7,
            borderRadius: 4,
            backgroundColor: "#D0D4DC",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 94,
            height: 29,
            borderRadius: 9,
            backgroundColor: "#004BFF",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.6,
          }}
        >
          INSTALL ITEM
        </div>
      </div>
    </div>
  );
}

export function renderIllustrationOgImage(slug: string) {
  const illustration = summaries.find(
    (item) => item.slug === slug && !item.hidden,
  );
  const title = illustration?.title ?? "Fixel UI";
  const description =
    illustration?.description ?? "Installable React interface illustrations.";
  const category = ILLUSTRATION_CATEGORIES[slug] ?? "React illustration";
  const titleSize = title.length > 15 ? 57 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 28,
          backgroundColor: "#EAEAEA",
          backgroundImage:
            "radial-gradient(circle, #C8CDD7 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          color: "#17191E",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "38px 42px",
            border: "1px solid #D8DBE2",
            borderRadius: 28,
            backgroundColor: "#F7F7F8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {brandMark()}
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: -1.2 }}>
              Fixel UI
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                padding: "10px 15px",
                border: "1px solid #DFE2E8",
                borderRadius: 18,
                backgroundColor: "#FFFFFF",
                color: "#4C5260",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {category.toUpperCase()}
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 590,
                paddingRight: 34,
              }}
            >
              <div
                style={{
                  color: "#004BFF",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1.7,
                }}
              >
                INSTALLABLE REACT ILLUSTRATION
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 18,
                  fontSize: titleSize,
                  fontWeight: 700,
                  letterSpacing: -3,
                  lineHeight: 1.08,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: "flex",
                  maxWidth: 525,
                  marginTop: 20,
                  color: "#5C626F",
                  fontSize: 23,
                  lineHeight: 1.45,
                }}
              >
                {description}
              </div>
            </div>
            <PreviewCard />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 17,
              borderTop: "1px solid #D8DBE2",
              color: "#656B78",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.8,
            }}
          >
            <span>Fixel UI · shadcn registry</span>
            <span>fixel-ui-v2.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

export function renderSiteOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 28,
          backgroundColor: "#EAEAEA",
          backgroundImage:
            "radial-gradient(circle, #C8CDD7 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          color: "#17191E",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "38px 42px",
            border: "1px solid #D8DBE2",
            borderRadius: 28,
            backgroundColor: "#F7F7F8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {brandMark()}
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: -1.2 }}>
              {site.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                padding: "10px 15px",
                border: "1px solid #DFE2E8",
                borderRadius: 18,
                backgroundColor: "#FFFFFF",
                color: "#4C5260",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              REACT ILLUSTRATION REGISTRY
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 590,
                paddingRight: 34,
              }}
            >
              <div
                style={{
                  color: "#17191E",
                  fontSize: 58,
                  fontWeight: 700,
                  letterSpacing: -3,
                  lineHeight: 1.08,
                }}
              >
                Wireframe UI.
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 4,
                  color: "#004BFF",
                  fontSize: 58,
                  fontWeight: 700,
                  letterSpacing: -3,
                  lineHeight: 1.08,
                }}
              >
                Ready to build.
              </div>
              <div
                style={{
                  display: "flex",
                  maxWidth: 520,
                  marginTop: 20,
                  color: "#5C626F",
                  fontSize: 21,
                  lineHeight: 1.4,
                }}
              >
                {site.description}
              </div>
            </div>
            <PreviewCard />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 17,
              borderTop: "1px solid #D8DBE2",
              color: "#656B78",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.8,
            }}
          >
            <span>{site.name} · shadcn registry</span>
            <span>ILLUSTRATIONS · RESOURCES · REACT</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
