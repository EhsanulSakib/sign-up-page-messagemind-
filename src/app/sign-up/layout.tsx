import CheckEmailSubmitWrapper from "@/components/wrapper/CheckEmailSubmitWrapper";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <CheckEmailSubmitWrapper>{children}</CheckEmailSubmitWrapper>
  </>;
}
