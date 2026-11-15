import React from 'react';

interface ProjectCardProps {
  children?: React.ReactNode;
  className?: string;
  image?: string;
  category?: string;
  title?: string;
  description?: string;
  tags?: string[];
  link?: string;
  modalTarget?: string;
}

export const SpotlightCard: React.FC<ProjectCardProps> = ({
  children,
  className = '',
  image,
  category,
  title,
  description,
  tags,
  link,
  modalTarget,
}) => {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-2xl hover:shadow-accent/10 ${className}`}
    >
      {/* Thumbnail Image Banner */}
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-surface-2">
          <img
            src={image}
            alt={title || 'Gambar Proyek'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {category && (
            <span className="absolute top-3 left-3 rounded-full border border-line/60 bg-bg/85 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Card Content Body */}
      {title && (
        <div className="flex flex-1 flex-col p-6">
          {!image && category && (
            <span className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              {category}
            </span>
          )}

          <h3 className="font-display font-bold text-xl text-ink tracking-tight mb-2.5 group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>

          {description && (
            <p className="text-ink-muted text-sm leading-relaxed mb-5 flex-1">
              {description}
            </p>
          )}

          {/* Tags Chips */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[11px] font-medium text-ink-muted transition-colors duration-200 group-hover:border-accent/40 group-hover:text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer / Action Button */}
          <div className="flex items-center justify-between border-t border-line/70 pt-4 mt-auto">
            {modalTarget ? (
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target={modalTarget}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors duration-200 cursor-pointer"
              >
                <span>Lihat Detail</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 border border-accent/25 text-accent group-hover:bg-accent group-hover:text-accent-ink transition-all duration-200">
                  &nearr;
                </span>
              </button>
            ) : link ? (
              <a
                href={link}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors duration-200 no-underline"
              >
                <span>Lihat Detail</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 border border-accent/25 text-accent group-hover:bg-accent group-hover:text-accent-ink transition-all duration-200">
                  &nearr;
                </span>
              </a>
            ) : null}
          </div>
        </div>
      )}

      {children}
    </article>
  );
};
