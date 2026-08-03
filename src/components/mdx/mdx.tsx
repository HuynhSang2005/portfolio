import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteProps } from "next-mdx-remote-client/rsc";
import type { LineElement } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { CopyButton } from "@/components/mdx/copy-button";
import { getIconForLanguageExtension } from "@/components/mdx/icons-language";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, Heading } from "@/components/ui/typography";
import {
  rehypeExternalLinksLocal,
  rehypeForwardRawString,
  rehypeRawString,
} from "@/features/blog/lib/hast-plugins";
import { cn } from "@/lib/utils";

const components: MDXRemoteProps["components"] = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  figure({ className, ...props }) {
    const hasPrettyCode = "data-rehype-pretty-code-figure" in props;
    return <figure className={cn(hasPrettyCode && "not-prose", className)} {...props} />;
  },
  figcaption: ({ children, ...props }) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption {...props}>
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  pre({
    __rawString__,
    ...props
  }: React.ComponentProps<"pre"> & {
    __rawString__?: string;
  }) {
    return (
      <>
        <pre {...props} />
        {__rawString__ && <CopyButton className="absolute top-2 right-2" value={__rawString__} />}
      </>
    );
  },
  code: Code,
  Steps: (props) => (
    <div className="prose-h3:text-wrap md:ml-3.5 md:border-l md:pl-7.5" {...props} />
  ),
  Step: ({ className, ...props }) => <h3 className={cn("step", className)} {...props} />,
};

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeExternalLinksLocal,
      rehypeSlug,
      rehypeRawString,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          keepBackground: false,
          onVisitLine(node: LineElement) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      rehypeForwardRawString,
    ],
  },
};

type MdxProps = {
  code: string;
  className?: string;
};

/** Renderer MDX RSC — stack plugin template + component map typography/table/code. */
export async function MDX({ code, className }: MdxProps): Promise<React.ReactElement> {
  const content = await MDXRemote({ source: code, components, options });
  return <article className={cn("", className)}>{content}</article>;
}
