import { motion } from 'framer-motion';
import ServiceIcon from './ServiceIcon.jsx';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-soft backdrop-blur-sm"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-ink/55">
        <ServiceIcon title={service.title} icon={service.icon} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-ink">{service.title}</h3>
      {service.description && <p className="text-sm leading-relaxed text-ink/60">{service.description}</p>}
    </motion.div>
  );
}
