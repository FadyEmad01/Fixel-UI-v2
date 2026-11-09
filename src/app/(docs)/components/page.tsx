import { ArticleSection, HeroSection, MethodsSidebar, PageLayout, TableOfContents } from "@/features/components/components/doc-page";

export default function Page() {
  return (
    <>
      <PageLayout
        leftSidebar={<TableOfContents />}
        rightSidebar={<MethodsSidebar />}
      >
        <HeroSection
          videoSrc="/previews/apple-folder.mp4"
          title="Gravity Mouse Trail"
          description="This mouse trail has a unique twist. As the user moves the cursor, images are created, fall to the bottom of the screen, bounce, and eventually fade away. Let's see how it works!"
        />

        <ArticleSection
          id="anchor1"
          title="HTML Structure"
          description="The structure here is quite simple. We will simply call the set of images we want for our effect:"
        >
          {/* <CodeBlock showCopyButton language="html"  code={codeSnippets.html} /> */}
          code block is here
        </ArticleSection>

        <ArticleSection
          id="anchor2"
          title="Some CSS"
          description="Now, I will hide these images using a bit of CSS."
        >
          {/* <CodeBlock code={codeSnippets.html} /> */}
          code block is here
        </ArticleSection>
      </PageLayout>
    </>
  );
}