import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCE() {
  const [content, setContent] = useState("");

  return (
    <Editor
      apiKey="i1gmr6fay3isyhj7s3dwnnpunjfsfjcoik3flqr0fa1xtij8"
      value={content}
      onEditorChange={(newContent: string) => setContent(newContent)}
      init={{
        plugins: [
          // Core editing features
          "anchor",
          "autolink",
          "charmap",
          "codesample",
          "emoticons",
          "image",
          "link",
          "lists",
          "media",
          "searchreplace",
          "table",
          "visualblocks",
          "wordcount",
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Apr 1, 2025:
          // "checklist",
          // "mediaembed",
          // "casechange",
          // "export",
          // "formatpainter",
          // "pageembed",
          // "a11ychecker",
          // "tinymcespellchecker",
          // "permanentpen",
          // "powerpaste",
          // "advtable",
          // "advcode",
          // "editimage",
          // "advtemplate",
          // "ai",
          // "mentions",
          // "tinycomments",
          // "tableofcontents",
          // "footnotes",
          // "mergetags",
          // "autocorrect",
          // "typography",
          // "inlinecss",
          // "markdown",
          // "importword",
          // "exportword",
          // "exportpdf",
        ],
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "First.Name", title: "First Name" },
          { value: "Email", title: "Email" },
        ],

        // ai_request: (request: any, respondWith: any) =>
        //   respondWith.string(() =>
        //     Promise.reject("See docs to implement AI Assistant")
        //   ),
      }}
      initialValue="Welcome to TinyMCE!"
    />
  );
}
