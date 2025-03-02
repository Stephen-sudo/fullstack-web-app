"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const router = useRouter();

  const handleSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };
      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);
      console.log(result);

      if (result.status === "SUCCESS") {
        toast(" Success", {
          description: "Your startup pitch has been created successfully.",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast(" Error", {
          description: "Please check your input and try again.",
          variant: "destructive",
        });

        return {
          ...prevState,
          error: "Validation failed",
          status: "ERROR",
        };
      }

      toast("Error", {
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          placeholder="Startup Title"
          required
        />
        {errors.title && <p className="startup_form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          placeholder="Startup Description"
          required
        />
        {errors.description && (
          <p className="startup_form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          placeholder="Startup Category(Tech,Health,Education ...)"
          required
        />
        {errors.category && (
          <p className="startup_form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="title" className="startup-form_label">
          Image
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          placeholder="Startup Image URL"
          required
        />
        {errors.link && <p className="startup_form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="title" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          height={300}
          preview="edit"
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{ disallowedElements: ["style"] }}
        />
        {errors.pitch && <p className="startup_form_error">{errors.pitch}</p>}
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting... " : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
