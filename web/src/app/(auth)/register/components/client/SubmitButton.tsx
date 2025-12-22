"use client"
import React from "react";
import styles from "./../../../styles/form.module.css";
import { useFormStatus } from "react-dom";

interface Props {
  isPending?: boolean
}

export default function SubmitButton({ isPending }: Props) {
  const { pending} = useFormStatus()

  return (
    <button
      type="submit"
      className={styles.primaryButton}
      style={{ opacity: pending ? 0.2 : 1 }}
      disabled={pending}
    >
      Create Account df
    </button>
  );
}
