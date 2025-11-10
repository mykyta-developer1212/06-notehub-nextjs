"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNotePayload } from "../../lib/api";
import type { Note } from "../../types/note";
import styles from "./NoteForm.module.css";

export interface NoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TAGS: CreateNotePayload["tag"][] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<CreateNotePayload["tag"]>()
    .oneOf(TAGS)
    .required("Tag is required"),
});

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: (payload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.();
    },
  });

  const initialValues: CreateNotePayload = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = (values: CreateNotePayload, helpers: FormikHelpers<CreateNotePayload>) => {
    mutation.mutate(values, {
      onSettled: () => {
        helpers.setSubmitting(false);
        helpers.resetForm();
      },
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={styles.input} />
            <ErrorMessage name="title" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={6} className={styles.textarea} />
            <ErrorMessage name="content" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting || mutation.isPending}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}