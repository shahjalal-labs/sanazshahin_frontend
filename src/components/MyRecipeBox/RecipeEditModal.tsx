"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useMemo, useState } from "react";
type RecipeEditDetails = {
  duration: string;
  energy: string;
  features: string[];
  needs: string[];
  nutrition: string[];
  howTo: string;
  youtubeLink: string;
};

type RecipeEditItem = {
  id: number;
  title: string;
  details: RecipeEditDetails;
};

type RecipeEditModalProps = {
  recipe: RecipeEditItem | null;
  onClose: () => void;
};

function RecipeEditModal({ recipe, onClose }: RecipeEditModalProps) {
  if (!recipe) {
    return null;
  }

  const details = recipe.details;
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

  useEffect(() => {
    setNeedsContent(details.needs.join("<br />"));
    setNutritionContent(details.nutrition.join("<br />"));
    setHowToContent(details.howTo);
  }, [recipe, details.howTo, details.needs, details.nutrition]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[980px] rounded-[14px] bg-white p-4 shadow-xl md:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="mb-6 text-[28px] font-semibold text-[#121212] md:mb-8 md:text-[42px]">
          Recipe Box Edit
        </h3>

        <form
          className="max-h-[64vh] overflow-y-auto pr-1"
          onSubmit={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <EditInput
              label="Recipe Name"
              placeholder="Enter meal name"
              defaultValue={recipe.title}
            />
            <EditInput
              label="Duration"
              placeholder="Enter duration"
              defaultValue={details.duration}
            />
            <EditInput
              label="Energy (kcal)"
              placeholder="Enter Energy (kcal)"
              defaultValue={details.energy}
            />
            <EditInput
              label="Features"
              placeholder="Enter Features"
              defaultValue={details.features.join(", ")}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-[#374151]">
              What You’ll Need
            </label>
            <Editor
              apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
              value={needsContent}
              init={editorConfig}
              onEditorChange={setNeedsContent}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-[#374151]">
              Nutrition
            </label>
            <Editor
              apiKey="4kjrncewwa4057zz04om0mle4q3to49bypq57bh6qgq5f0n3"
              value={nutritionContent}
              init={editorConfig}
              onEditorChange={setNutritionContent}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-[#374151]">
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
              defaultValue={details.youtubeLink}
              placeholder="Enter Youtube link"
              className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] focus:border-[#8FA4CF] md:h-[70px] md:text-[22px]"
            />
          </div>

          <div className="mt-8 flex justify-center md:justify-end">
            <button
              type="submit"
              className="h-11 min-w-[130px] rounded-full bg-[#0F2FA8] px-9 text-[16px] font-medium text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditInput({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[20px] font-medium text-[#111111] md:text-[22px]">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-[64px] w-full rounded-[26px] border border-[#C9D2E2] bg-[#FAFCFF] px-5 text-[20px] text-[#111111] outline-none placeholder:text-[#A4B2C7] focus:border-[#8FA4CF] md:h-[70px] md:text-[22px]"
      />
    </div>
  );
}

export default RecipeEditModal;
