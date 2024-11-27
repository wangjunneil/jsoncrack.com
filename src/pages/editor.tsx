import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import styled, { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import { darkTheme, lightTheme } from "src/constants/theme";
import { Editor } from "src/containers/Editor";
import { BottomBar } from "src/containers/Editor/components/BottomBar";
// import { UpgradeModal } from "src/containers/Modals";
import { Toolbar } from "src/containers/Toolbar";
import useConfig from "src/store/useConfig";
import useFile from "src/store/useFile";

const ModalController = dynamic(() => import("src/layout/ModalController"));
const ExternalMode = dynamic(() => import("src/layout/ExternalMode"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const EditorPage = () => {
  const { query, isReady } = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const [upgradeVisible, setUpgradeVisible] = React.useState(false);

  React.useEffect(() => {
    const isUpgradeShown = Cookie.get("upgrade_shown");
    if (!isUpgradeShown) setUpgradeVisible(true);
  }, []);

  React.useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  React.useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  return (
    <>
      <NextSeo
        {...SEO}
        title="JSON Crack"
        description="JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more."
      />
      <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
        <QueryClientProvider client={queryClient}>
          <ExternalMode />
          <ModalController />
          {/* <UpgradeModal
            opened={upgradeVisible}
            onClose={() => {
              setUpgradeVisible(false);
              Cookie.set("upgrade_shown", "true", { expires: 1 });
            }}
          /> */}
          <StyledEditorWrapper>
            <StyledPageWrapper>
              <Toolbar />
              <StyledEditorWrapper>
                <Editor />
              </StyledEditorWrapper>
            </StyledPageWrapper>
            <BottomBar />
          </StyledEditorWrapper>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default EditorPage;
