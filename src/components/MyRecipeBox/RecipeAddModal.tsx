"use client";
import { useCreateRecipeMutation } from "@/redux/api/recipeApi";
import { Editor } from "@tinymce/tinymce-react";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type RecipeAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RecipeFormData = {
  recipeName: string;
  duration: string;
  energy: string;
  features: string;
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
    duration: "",
    energy: "",
    features: "",
    youtubeLink: "",
  });
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
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

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateRecipe = async () => {
    try {
      const features = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const payload = new FormData();
      payload.append(
        "bodyData",
        JSON.stringify({
          recipeName: formData.recipeName.trim(),
          duration: Number(formData.duration.trim()),
          energy: Number(formData.energy.trim()),
          features,
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
        duration: "",
        energy: "",
        features: "",
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

    if (!formData.duration.trim() || Number.isNaN(Number(formData.duration))) {
      toast.error("Duration must be a valid number");
      return;
    }

    if (!formData.energy.trim() || Number.isNaN(Number(formData.energy))) {
      toast.error("Energy must be a valid number");
      return;
    }

    if (!recipeImage) {
      toast.error("Recipe image is required");
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
              onChange={(value) => handleInputChange("duration", value)}
            />
            <AddInput
              label="Energy (kcal)"
              placeholder="Enter Energy (kcal)"
              value={formData.energy}
              onChange={(value) => handleInputChange("energy", value)}
            />
            <AddInput
              label="Features"
              placeholder="Enter Features"
              value={formData.features}
              onChange={(value) => handleInputChange("features", value)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
              Recipe image
            </label>
            <div className="mb-3">
              {imagePreview ? (
                <div className="overflow-hidden rounded-[24px] border border-[#C9D2E2] bg-[#FAFCFF]">
                  <img
                    src={imagePreview}
                    alt="Selected recipe preview"
                    className="h-[220px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-[220px] w-full items-center justify-center rounded-[24px] border border-dashed border-[#C9D2E2] bg-[#FAFCFF] text-[16px] text-[#7B8794]">
                  Image preview will appear here
                </div>
              )}
            </div>
            <input
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
              className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[16px] text-[#111111] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-[14px] file:font-medium file:text-white hover:file:opacity-90 focus:border-[#8FA4CF] md:h-[70px] md:text-[18px]"
            />
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
              type="text"
              placeholder="Enter Youtube link"
              value={formData.youtubeLink}
              onChange={(event) =>
                handleInputChange("youtubeLink", event.target.value)
              }
              className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] focus:border-[#8FA4CF] md:h-[70px] md:text-[22px]"
            />
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
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] focus:border-[#8FA4CF] md:h-[70px] md:text-[22px]"
      />
    </div>
  );
}

export default RecipeAddModal;
