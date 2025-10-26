import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative text-center h-[500px] sm:h-[700px]">
        {/* Background Image */}
        <Image
            src="/banner3.webp"
            alt="banner image"
            fill
            className="object-cover"
            priority
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-start px-10 text-start justify-center h-full bg-black/40 text-white px-4">
            <h1 className="text-xl sm:text-3xl font-light tracking-wide uppercase max-w-3xl">
            In the right outfit<br /> anything is possible
            </h1>
            <div className="mt-6 flex justify-center gap-4 text-xs">
            <button className="bg-white text-black px-6 py-2 rounded-full cursor-pointer">Collections</button>
            <button className="border border-white px-6 py-2 rounded-full cursor-pointer">Shop Now</button>
            </div>
        </div>
        </section>
  )
}

export default Hero