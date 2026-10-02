import * as runtime from "react/jsx-runtime";

function useMDXComponent(code: string) {
  const fn = new Function(code);

  return fn({
    ...runtime,
  }).default as React.ComponentType<{ components?: MDXComponents }>;
}

type MDXComponents = Record<string, unknown>;

interface MDXContentProps {
  code: string;
  components?: MDXComponents;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
}
