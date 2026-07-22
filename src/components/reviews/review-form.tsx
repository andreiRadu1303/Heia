'use client';

import * as React from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  SUBSCORES,
  TAGS,
  type ReviewScores,
  type WouldReturn,
} from '@/lib/reviews';

export interface ReviewDraft {
  scores: ReviewScores;
  recommend: boolean;
  wouldReturn: WouldReturn;
  tags: string[];
  body: string;
}

export function ReviewForm({
  studioName,
  onSubmit,
}: {
  studioName: string;
  onSubmit: (draft: ReviewDraft) => void;
}) {
  const [scores, setScores] = React.useState<ReviewScores>({
    quality: 0,
    cleanliness: 0,
    value: 0,
  });
  const [recommend, setRecommend] = React.useState<boolean | null>(null);
  const [wouldReturn, setWouldReturn] = React.useState<WouldReturn | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [body, setBody] = React.useState('');

  const allScored = scores.quality > 0 && scores.cleanliness > 0 && scores.value > 0;

  const toggleTag = (id: string) =>
    setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const submit = () => {
    if (!allScored) return;
    onSubmit({
      scores,
      recommend: recommend ?? true,
      wouldReturn: wouldReturn ?? 'maybe',
      tags,
      body: body.trim(),
    });
  };

  const positive = TAGS.filter((t) => t.sentiment === 'positive');
  const negative = TAGS.filter((t) => t.sentiment === 'negative');

  return (
    <div className="space-y-8">
      {/* Sub-scores */}
      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Rate your experience at {studioName}. Your overall score is the average of these three.
        </p>
        {SUBSCORES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">{label}</span>
            <StarInput
              value={scores[key]}
              onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
            />
          </div>
        ))}
      </section>

      {/* Recommend */}
      <Field label="Would you recommend this studio?">
        <div className="flex gap-2">
          <Choice active={recommend === true} onClick={() => setRecommend(true)}>
            <ThumbsUp className="size-4" /> Yes
          </Choice>
          <Choice active={recommend === false} onClick={() => setRecommend(false)}>
            <ThumbsDown className="size-4" /> No
          </Choice>
        </div>
      </Field>

      {/* Would return */}
      <Field label="Would you come back?">
        <div className="flex gap-2">
          {(['yes', 'maybe', 'no'] as WouldReturn[]).map((v) => (
            <Choice key={v} active={wouldReturn === v} onClick={() => setWouldReturn(v)}>
              <span className="capitalize">{v}</span>
            </Choice>
          ))}
        </div>
      </Field>

      {/* Tags */}
      <Field label="Quick tags (optional)">
        <div className="space-y-2.5">
          <TagRow tags={positive} selected={tags} onToggle={toggleTag} sentiment="positive" />
          <TagRow tags={negative} selected={tags} onToggle={toggleTag} sentiment="negative" />
        </div>
      </Field>

      {/* Free text */}
      <Field label="Anything to add? (optional)">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What did you love? What could be better?"
          className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-base leading-relaxed"
        />
      </Field>

      <div className="space-y-2">
        <Button onClick={submit} disabled={!allScored} className="h-11 w-full">
          Submit review
        </Button>
        {!allScored ? (
          <p className="text-center text-xs text-muted-foreground">
            Rate all three categories to continue.
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = React.useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5"
        >
          <Star
            className={cn(
              'size-6 transition-colors',
              n <= shown ? 'fill-accent text-accent' : 'text-muted-foreground/40',
            )}
          />
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </section>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        active ? 'border-foreground bg-secondary/60' : 'border-border hover:bg-secondary/30',
      )}
    >
      {children}
    </button>
  );
}

function TagRow({
  tags,
  selected,
  onToggle,
  sentiment,
}: {
  tags: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  sentiment: 'positive' | 'negative';
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => {
        const active = selected.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            aria-pressed={active}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? sentiment === 'positive'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-destructive bg-destructive/10 text-destructive'
                : 'border-border text-muted-foreground hover:bg-secondary/30',
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
