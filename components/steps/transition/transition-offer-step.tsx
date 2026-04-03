"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useStepper } from "@/context/StepperContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

const SLIDES = [
  {
    image: "",
    title: "",
  },
  {
    image: "/transition/heart.svg",
    title: "Compréhension",
    subtitle: "de vos besoins",
  },
  {
    image: "/transition/umbrella.svg",
    title: "Protection adaptée à votre quotidien",
  },
  {
    image: "/transition/phone.svg",
    title: "Équilibre couverture / budget",
  },
  {
    image: "/transition/brain.svg",
    title: "Intégration prévention & bien-être",
  },
  {
    image: "/transition/lock.svg",
    title: "Préparation de votre devis",
  },
  {
    image: "",
    title: "",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TransitionOfferStep() {
  const { next } = useStepper();
  const [imageApi, setImageApi] = useState<CarouselApi>();
  const [textApi, setTextApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  /* Sync text carousel to image carousel */
  useEffect(() => {
    if (!imageApi) return;

    const onSelect = () => {
      const idx = imageApi.selectedScrollSnap();
      setCurrent(idx);
      textApi?.scrollTo(idx);
    };

    imageApi.on("select", onSelect);
    onSelect();

    return () => {
      imageApi.off("select", onSelect);
    };
  }, [imageApi, textApi]);

  /* Sync image carousel to text carousel */
  useEffect(() => {
    if (!textApi) return;

    const onSelect = () => {
      const idx = textApi.selectedScrollSnap();
      setCurrent(idx);
      imageApi?.scrollTo(idx);
    };

    textApi.on("select", onSelect);

    return () => {
      textApi.off("select", onSelect);
    };
  }, [textApi, imageApi]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(183.97% 101.35% at 50% 100%, #FBF4EA 0%, #FEA8CD 34.13%, #CE99FF 62.98%, #9000E3 80.77%, #490076 100%)",
      }}
    >
      {/* ── Title ── */}
      <h1
        className="text-center text-2xl sm:text-3xl font-bold px-6"
        style={{ color: "#F3E5FA" }}
      >
        On prépare
        <br />
        votre couverture idéale
      </h1>

      {/* ── Subtitle ── */}
      <p
        className="mt-2 text-center text-sm sm:text-base px-6"
        style={{ color: "#F3E5FA" }}
      >
        On s&apos;occupe de tout
      </p>

      {/* ── Carousels ── */}
      <div className="mt-8 flex flex-col items-center w-full">
        {/* ── Image Carousel (single element, manual scroll) ── */}
        <Carousel
          setApi={setImageApi}
          opts={{ align: "center", loop: false }}
          className="w-full max-w-[12rem] sm:max-w-xs"
        >
          <CarouselContent>
            {SLIDES.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center p-2">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={220}
                    height={240}
                    className="h-[180px] w-[180px] sm:h-[220px] sm:w-[200px] object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* ── Text Carousel (3 elements visible, synced) ── */}
        <Carousel
          setApi={setTextApi}
          opts={{ align: "center", loop: false }}
          className="mt-6 w-full max-w-sm sm:max-w-md md:max-w-lg"
        >
          <CarouselContent className="-ml-1">
            {SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="basis-1/3 pl-1">
                <div className="flex items-center justify-center text-center p-1">
                  <h2
                    className={`font-bold leading-tight transition-all duration-300 ${
                      current === index - 1
                        ? "text-base sm:text-lg md:text-xl opacity-100"
                        : "text-xs sm:text-sm opacity-40"
                    }`}
                    style={{ color: "#490076" }}
                  >
                    {slide.title}
                  </h2>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
