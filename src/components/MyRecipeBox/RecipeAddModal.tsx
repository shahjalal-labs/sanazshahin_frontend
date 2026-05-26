"use client";
import { useCreateRecipeMutation } from "@/redux/api/recipeApi";
import { Editor } from "@tinymce/tinymce-react";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type RecipeAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RecipeFormData = {
  recipeName: string;
  duration: number;
  energy: number;
  features: string[];
  equipments: string[];
  ingredients: string[];
  youtubeLink: string;
};

function RecipeAddModal({ isOpen, onClose }: RecipeAddModalProps) {
  const editorConfig = useMemo(
    () => ({
      plugins:
        "advlist autolink link image lists charmap preview anchor pagebreak " +
        "searchreplace wordcount visualblocks code fullscreen insertdatetime media " +
        "table emoticons help",
      toolbar:
        "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | link image | preview media fullscreen | " +
        "forecolor backcolor emoticons | help",
      menubar: "",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
      height: 280,
    }),
    [],
  );

  const [needsContent, setNeedsContent] = useState<string>("");
  const [nutritionContent, setNutritionContent] = useState<string>("");
  const [howToContent, setHowToContent] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<RecipeFormData>({
    recipeName: "",
    duration: 0,
    energy: 0,
    features: [],
    equipments: [],
    ingredients: [],
    youtubeLink: "",
  });
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [youtubeError, setYoutubeError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    field: keyof RecipeFormData,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as RecipeFormData);
  };

  const validateYoutube = (value: string) => {
    const v = value.trim();
    if (!v) {
      setYoutubeError("Youtube link is required");
      return false;
    }

    try {
      new URL(v);
      setYoutubeError("");
      return true;
    } catch (e) {
      setYoutubeError("Youtube link must be a valid URL");
      return false;
    }
  };

  const handleCreateRecipe = async () => {
    try {
      const duration = Number(formData.duration);
      const energy = Number(formData.energy);
      const features = formData.features;
      const equipments = formData.equipments;
      const ingredients = formData.ingredients;

      const payload = new FormData();
      payload.append(
        "bodyData",
        JSON.stringify({
          recipeName: formData.recipeName.trim(),
          duration,
          energy,
          features,
          equipments,
          ingredients,
          wyn: needsContent,
          nutrition: nutritionContent,
          hymi: howToContent,
          youtubeLink: formData.youtubeLink.trim(),
        }),
      );

      if (recipeImage) {
        payload.append("recipeImage", recipeImage);
      }

      await createRecipe(payload).unwrap();
      toast.success("Recipe created successfully");
      setFormData({
        recipeName: formData.recipeName.trim(),
        duration: 0,
        energy: 0,
        features: [],
        equipments: [],
        ingredients: [],
        youtubeLink: "",
      });
      setNeedsContent("");
      setNutritionContent("");
      setHowToContent("");
      setRecipeImage(null);
      onClose();
    } catch (error) {
      toast.error("Failed to create recipe");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.recipeName.trim()) {
      toast.error("Recipe name is required");
      return;
    }

    if (!Number.isFinite(Number(formData.duration))) {
      toast.error("Duration must be a valid number");
      return;
    }

    if (!Number.isFinite(Number(formData.energy))) {
      toast.error("Energy must be a valid number");
      return;
    }

    if (!recipeImage) {
      toast.error("Recipe image is required");
      return;
    }

    if (!formData.youtubeLink.trim()) {
      toast.error("Youtube link is required");
      return;
    }

    try {
      // validate url format
      // eslint-disable-next-line no-new
      new URL(formData.youtubeLink.trim());
    } catch (e) {
      toast.error("Youtube link must be a valid URL");
      return;
    }

    await handleCreateRecipe();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[980px] rounded-[14px] bg-white p-4 shadow-xl md:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between md:mb-8">
          <h3 className="text-[28px] font-semibold text-[#121212] md:text-[32px]">
            Add New Recipe
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F2F5] text-[#5F6773] transition hover:bg-[#E4E7EB]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>

        <form
          className="max-h-[76vh] overflow-y-auto pr-1"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <AddInput
              label="Recipe Name"
              placeholder="Enter meal name"
              value={formData.recipeName}
              onChange={(value) => handleInputChange("recipeName", value)}
            />
            <AddInput
              label="Duration"
              placeholder="Enter duration"
              value={formData.duration}
              inputType="number"
              onChange={(value) => handleInputChange("duration", value)}
            />
            <AddInput
              label="Energy (kcal)"
              placeholder="Enter Energy (kcal)"
              value={formData.energy}
              inputType="number"
              onChange={(value) => handleInputChange("energy", value)}
            />
            <TagInput
              label="Features"
              placeholder="Type a feature and press Enter"
              tags={formData.features}
              onChange={(tags) => handleInputChange("features", tags)}
            />
            <TagInput
              label="Equipments"
              placeholder="Type equipment and press Enter"
              tags={formData.equipments}
              onChange={(tags) => handleInputChange("equipments", tags)}
            />
            <TagInput
              label="Ingredients"
              placeholder="Type ingredient and press Enter"
              tags={formData.ingredients}
              onChange={(tags) => handleInputChange("ingredients", tags)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
              Recipe image
            </label>
            <div className="mb-3">
              {imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer overflow-hidden rounded-[24px] border border-[#C9D2E2] bg-[#FAFCFF]"
                >
                  <img
                    src={imagePreview}
                    alt="Selected recipe preview"
                    className="h-[220px] w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer flex h-[220px] w-full items-center justify-center rounded-[24px] border border-dashed border-[#C9D2E2] bg-[#FAFCFF] text-[16px] text-[#7B8794]"
                >
                  Image preview will appear here
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  if (imagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                  }

                  if (!file) {
                    setRecipeImage(null);
                    setImagePreview("");
                    return;
                  }

                  if (!file.type.startsWith("image/")) {
                    toast.error("Please select a valid image file");
                    return;
                  }

                  setRecipeImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="block font-medium text-[#374151] text-[20px]">
              What You'll Need
            </label>
            <Editor
              apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
              value={needsContent}
              init={editorConfig}
              onEditorChange={setNeedsContent}
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block font-medium text-[#374151] text-[20px]">
              Nutrition
            </label>
            <Editor
              apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
              value={nutritionContent}
              init={editorConfig}
              onEditorChange={setNutritionContent}
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block font-medium text-[#374151] text-[20px]">
              How You'll Make It
            </label>
            <Editor
              apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
              value={howToContent}
              init={editorConfig}
              onEditorChange={setHowToContent}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
              Youtube link
            </label>
            <input
              type="url"
              placeholder="Enter Youtube link"
              value={formData.youtubeLink}
              onChange={(event) => {
                const v = event.target.value;
                handleInputChange("youtubeLink", v);

                if (youtubeError) validateYoutube(v);
              }}
              onBlur={() => validateYoutube(formData.youtubeLink)}
              className={`h-[64px] w-full rounded-[26px] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] md:h-[70px] md:text-[22px] ${
                youtubeError
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#C9D2E2] focus:border-[#8FA4CF]"
              }`}
            />
            {youtubeError && (
              <p className="mt-2 text-sm text-red-600">{youtubeError}</p>
            )}
          </div>

          <div className="mt-8 flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 min-w-[130px] rounded-full bg-primary px-9 text-[16px] font-medium text-white disabled:opacity-70"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddInput({
  label,
  placeholder,
  value,
  inputType = "text",
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string | number;
  inputType?: "text" | "number";
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
        {label}
      </label>
      <input
        type={inputType}
        inputMode={inputType === "number" ? "numeric" : undefined}
        min={inputType === "number" ? 0 : undefined}
        step={inputType === "number" ? 1 : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] focus:border-[#8FA4CF] md:h-[70px] md:text-[22px]"
      />
    </div>
  );
}

function TagInput({
  label,
  placeholder,
  tags,
  onChange,
}: {
  label: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setInputValue("");
      return;
    }
    onChange([...tags, v]);
    setInputValue("");
  };

  const removeTag = (t: string) => {
    onChange(tags.filter((x) => x !== t));
  };

  return (
    <div>
      <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
        {label}
      </label>

      <div className="flex w-full flex-wrap items-center gap-2 rounded-[12px] border border-[#C9D2E2] bg-[#FAFCFF] px-3 py-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-lg text-[#11389D]"
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={() => removeTag(t)}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#DDE8FF] text-[#11389D]"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(inputValue);
            }
          }}
          onBlur={() => addTag(inputValue)}
          className="h-[40px] min-w-[160px] flex-1 bg-transparent px-2 text-xl text-[#111111] outline-none placeholder:text-[#A4B2C7]"
        />
      </div>
    </div>
  );
}

export default RecipeAddModal;
