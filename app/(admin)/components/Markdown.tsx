import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ ...props }) => {
          return <ul {...props} className="list-disc list-inside ml-5 mb-5" />;
        },
        ol: ({ ...props }) => {
          return (
            <ol {...props} className="list-decimal list-inside ml-5 mb-5" />
          );
        },
        h1: ({ ...props }) => {
          return <h1 {...props} className="text-2xl font-bold mb-5" />;
        },
        h2: ({ ...props }) => {
          return <h2 {...props} className="text-xl font-bold mb-5" />;
        },
        h3: ({ ...props }) => {
          return <h3 {...props} className="text-lg front-bold mb-5" />;
        },
        table: ({ ...props }) => {
          return (
            <table
              {...props}
              className="table-auto w-full border-separate borrder-2 rounded-sm border-spacing-r border-white mb-5"
            />
          );
        },
        th: ({ ...props }) => {
          return <th {...props} className="text-left underline" />;
        },

        a: ({ ...props }) => {
          return (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-blue-400"
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
export default Markdown;
