"use client";

import { useFormik, ErrorMessage, FormikProvider } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { CreateNoteData, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string().oneOf(TAGS).required("Tag is required"),
});

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const formik = useFormik<CreateNoteData>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <h2 className={css.heading}>Create New Note</h2>
      <form onSubmit={formik.handleSubmit} className={css.form}>
        <label className={css.label}>
          Title
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </label>

        <label className={css.label}>
          Content
          <textarea
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={css.textarea}
            rows={4}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </label>

        <label className={css.label}>
          Tag
          <select
            name="tag"
            value={formik.values.tag}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={css.select}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </label>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending || !formik.isValid}
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>

        {mutation.isError && (
          <p className={css.error}>Failed to create note. Try again.</p>
        )}
      </form>
    </FormikProvider>
  );
}
