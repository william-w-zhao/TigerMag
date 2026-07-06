import { useEffect, useMemo, useState } from "react";

import ArticleDisplay from "../components/ArticleDisplay";
import CardLarge from "../components/CardLarge";
import CardMedium from "../components/CardMedium";
import Loading from "../components/Loading";
import { getArticles } from "../services/articles";
import {
  getLayoutModules,
  updateLayoutModuleSlot,
  removeLayoutModuleSlot,
} from "../services/layouts";

const News = ({ editMode = false }) => {
  const [modules, setModules] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const layoutID = "news";

  useEffect(() => {
    const loadNews = async () => {
      try {
        const [modulesData, articlesData] = await Promise.all([
          getLayoutModules(layoutID),
          getArticles(),
        ]);

        setModules(modulesData);
        setArticles(articlesData);
      } catch (e) {
        console.error("Failed to load news layout", e);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const articlesById = useMemo(() => {
    return Object.fromEntries(articles.map((article) => [article.id, article]));
  }, [articles]);

  const getModule = (moduleKey) => {
    return modules.find((module) => module.module_key === moduleKey);
  };

  const getSlot = (moduleKey, slot) => {
    return getModule(moduleKey)?.config?.slots?.[slot] ?? null;
  };

  const getArticle = (moduleKey, slot) => {
    const articleID = getSlot(moduleKey, slot);
    return articleID ? articlesById[articleID] : null;
  };

  const loadArticle = async (moduleKey, slot, articleID) => {
    setModules((existing) =>
      existing.map((module) => {
        if (module.module_key !== moduleKey) return module;

        return {
          ...module,
          config: {
            ...(module.config ?? {}),
            slots: {
              ...(module.config?.slots ?? {}),
              [slot]: articleID,
            },
          },
        };
      })
    );

    try {
      await updateLayoutModuleSlot(layoutID, moduleKey, slot, articleID);
    } catch (e) {
      console.error("Supabase layout write failed:", e);
    }
  };

  const removeArticle = async (moduleKey, slot) => {
    setModules((existing) =>
      existing.map((module) => {
        if (module.module_key !== moduleKey) return module;

        return {
          ...module,
          config: {
            ...(module.config ?? {}),
            slots: {
              ...(module.config?.slots ?? {}),
              [slot]: null,
            },
          },
        };
      })
    );

    try {
      await removeLayoutModuleSlot(layoutID, moduleKey, slot);
    } catch (e) {
      console.error("Supabase layout remove failed:", e);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-stretch gap-3">
        <section className="order-1 h-full lg:border-r lg:border-gray-200 lg:pr-4 bg-white">
          <CardLarge
            articleID={getSlot("hero", "a1")}
            article={getArticle("hero", "a1")}
            setArticle={(id) => loadArticle("hero", "a1", id)}
            removeArticle={() => removeArticle("hero", "a1")}
            editMode={editMode}
          />
        </section>

        <section className="hidden lg:flex order-2 h-full flex-col divide-y divide-gray-200">
          <CardMedium
            articleID={getSlot("side_column", "b1")}
            article={getArticle("side_column", "b1")}
            setArticle={(id) => loadArticle("side_column", "b1", id)}
            removeArticle={() => removeArticle("side_column", "b1")}
            editMode={editMode}
          />

          <CardMedium
            articleID={getSlot("side_column", "b2")}
            article={getArticle("side_column", "b2")}
            setArticle={(id) => loadArticle("side_column", "b2", id)}
            removeArticle={() => removeArticle("side_column", "b2")}
            editMode={editMode}
          />
        </section>
      </div>

      <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mt-4 mb-2" />
      <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mb-2 lg:mb-8" />

      <div className="max-w-full mx-auto lg:max-w-[70%]">
        <ArticleDisplay section="NEWS" />
      </div>
    </div>
  );
};

export default News;