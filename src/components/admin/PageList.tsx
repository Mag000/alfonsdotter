import {
  Badge,
  makeStyles,
  Text,
  tokens,
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components";
import {
  Document24Regular,
  ErrorCircle16Regular,
  Warning16Regular,
} from "@fluentui/react-icons";
import React from "react";
import { IValidationError } from "../../model/IEditorState";
import { IPage } from "../../model/IPage";

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalS,
  },
  header: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  treeItem: {
    cursor: "pointer",
  },
  selectedItem: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderRadius: tokens.borderRadiusMedium,
  },
  itemContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    flex: 1,
  },
  navTitle: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  navText: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  errorIcon: {
    color: tokens.colorPaletteRedForeground1,
  },
  warningIcon: {
    color: tokens.colorPaletteYellowForeground1,
  },
  emptyState: {
    padding: tokens.spacingVerticalL,
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  badges: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
  },
});

interface IPageListProps {
  pages: IPage[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  validationErrors: IValidationError[];
}

export const PageList: React.FC<IPageListProps> = ({
  pages,
  selectedIndex,
  onSelect,
  validationErrors,
}) => {
  const styles = useStyles();

  // Get error/warning counts per page
  const getPageErrors = (pageIndex: number) => {
    const pageErrors = validationErrors.filter(
      (e) => e.pageIndex === pageIndex,
    );
    return {
      errors: pageErrors.filter((e) => e.severity === "error").length,
      warnings: pageErrors.filter((e) => e.severity === "warning").length,
    };
  };

  if (pages.length === 0) {
    return (
      <div>
        <div className={styles.header}>Pages</div>
        <div className={styles.emptyState}>
          <Text>No pages loaded</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>Pages ({pages.length})</div>
      <div className={styles.container}>
        <Tree aria-label="Page list">
          {pages.map((page, index) => {
            const { errors, warnings } = getPageErrors(index);
            const isSelected = selectedIndex === index;

            return (
              <TreeItem
                key={index}
                itemType="leaf"
                className={`${styles.treeItem} ${isSelected ? styles.selectedItem : ""}`}
                onClick={() => onSelect(index)}
              >
                <TreeItemLayout
                  iconBefore={<Document24Regular />}
                  aside={
                    <div className={styles.badges}>
                      {errors > 0 && (
                        <Badge
                          size="small"
                          color="danger"
                          icon={<ErrorCircle16Regular />}
                        >
                          {errors}
                        </Badge>
                      )}
                      {warnings > 0 && (
                        <Badge
                          size="small"
                          color="warning"
                          icon={<Warning16Regular />}
                        >
                          {warnings}
                        </Badge>
                      )}
                    </div>
                  }
                >
                  <div className={styles.itemContent}>
                    <div className={styles.navTitle}>
                      <Text weight={isSelected ? "semibold" : "regular"}>
                        {page.navText || page.navTitle}
                      </Text>
                      {page.navText && (
                        <Text className={styles.navText}> {page.navTitle}</Text>
                      )}
                    </div>
                  </div>
                </TreeItemLayout>
              </TreeItem>
            );
          })}
        </Tree>
      </div>
    </div>
  );
};

export default PageList;
