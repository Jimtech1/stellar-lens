import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "DeFi Trader",
    avatar: "A",
    content: "Yielder simplified my cross-chain portfolio management. I can now track all my assets in one place and find the best yield opportunities instantly.",
    rating: 5,
  },
  {
    name: "Sarah Miller",
    role: "Crypto Investor",
    avatar: "S",
    content: "The bridge optimizer saved me hundreds in fees. The real-time analytics help me make better investment decisions every day.",
    rating: 5,
  },
  {
    name: "Michael Park",
    role: "Protocol Developer",
    avatar: "M",
    content: "As a developer, I appreciate the clean interface and powerful features. Yielder is exactly what the Stellar ecosystem needed.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 font-bold text-foreground mb-4">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about their experience with Yielder
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="bg-card rounded-xl p-6 border border-border relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 text-small leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-small">{testimonial.name}</p>
                  <p className="text-tiny text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
