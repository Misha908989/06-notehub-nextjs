"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { CreateNoteData, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping", "Other"];

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    mutation.mutate({ title: title.trim(), content: content.trim(), tag });
  }

  return (
    <div className={css.overlay}>
      <div className={css.modal}>
        <h2 className={css.heading}>Create New Note</h2>
        <form onSubmit={handleSubmit} className={css.form}>
          <label className={css.label}>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={css.input}
              required
            />
          </label>
          <label className={css.label}>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={css.textarea}
              rows={4}
              required
            />
          </label>
          <label className={css.label}>
            Tag
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as NoteTag)}
              className={css.select}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <div className={css.actions}>
            <button
              type="button"
              onClick={onClose}
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
          {mutation.isError && (
            <p className={css.error}>Failed to create note. Try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
