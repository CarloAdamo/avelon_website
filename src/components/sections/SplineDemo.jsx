import { motion } from 'framer-motion';
import SplineScene from '../ui/SplineScene';
import Spotlight from '../ui/Spotlight';
import Container from '../ui/Container';

export default function SplineDemo() {
  return (
    <section className="py-20">
      <Container>
        <div className="w-full h-[500px] bg-white rounded-2xl relative overflow-hidden border border-gray-200 shadow-lg">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6B5B95" />

          <div className="flex h-full">
            {/* Left: text */}
            <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500"
              >
                Interactive 3D
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-4 text-gray-600 max-w-lg"
              >
                Bring your UI to life with beautiful 3D scenes.
                Built with Spline and React.
              </motion.p>
            </div>

            {/* Right: 3D scene */}
            <div className="flex-1 relative">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
