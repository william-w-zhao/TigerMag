import { useEffect, useMemo, useState } from "react";
import CardLarge from "../components/CardLarge";
import CardMedium from "../components/CardMedium";
import CardSmall from "../components/CardSmall";
import Loading from "../components/Loading";
import { getArticles } from "../services/articles";
import {
  getHomeModules,
  updateHomeModuleSlot,
  removeHomeModuleSlot,
} from "../services/layouts";

const Home = ({ editMode = false }) => {
  const [modules, setModules] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [modulesData, articlesData] = await Promise.all([
          getHomeModules(),
          getArticles(),
        ]);

        setModules(modulesData);
        setArticles(articlesData);
      } catch (e) {
        console.log("Failed to load home", e.message, e);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
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
            ...module.config,
            slots: {
              ...(module.config?.slots ?? {}),
              [slot]: articleID,
            },
          },
        };
      })
    );

    try {
      await updateHomeModuleSlot(moduleKey, slot, articleID);
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
            ...module.config,
            slots: {
              ...(module.config?.slots ?? {}),
              [slot]: null,
            },
          },
        };
      })
    );

    try {
      await removeHomeModuleSlot(moduleKey, slot);
    } catch (e) {
      console.error("Supabase layout remove failed:", e);
    }
  };

  if (loading) return <div style={{ padding: 24 }}><Loading /></div>;

  return (
    <div className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-stretch gap-3">
            <section className="hidden lg:block lg:order-2 h-full lg:border-l lg:border-r lg:border-gray-200 lg:px-4 bg-white">
                <CardLarge 
                    articleID={getSlot("hero", "a1")} 
                    article={getArticle("hero", "a1")}
                    setArticle={(id) => loadArticle("hero", "a1", id)} 
                    removeArticle={() => removeArticle("hero", "a1")} 
                    editMode={editMode}/>
            </section>
            <section className="hidden lg:flex lg:order-1 h-full flex-col divide-y divide-gray-200">
                <CardMedium
                    articleID={getSlot("left_column", "b1")}
                    article={getArticle("left_column", "b1")}
                    setArticle={(id) => loadArticle("left_column", "b1", id)}
                    removeArticle={() => removeArticle("left_column", "b1")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("left_column", "b2")}
                    article={getArticle("left_column", "b2")}
                    setArticle={(id) => loadArticle("left_column", "b2", id)}
                    removeArticle={() => removeArticle("left_column", "b2")}
                    editMode={editMode}
                />
            </section>
            <section className="hidden lg:flex order-3 lg:order-3 h-full flex-col divide-y divide-gray-200">
                <CardSmall
                    articleID={getSlot("right_column", "c1")}
                    article={getArticle("right_column", "c1")}
                    setArticle={(id) => loadArticle("right_column", "c1", id)}
                    removeArticle={() => removeArticle("right_column", "c1")}
                    editMode={editMode}
                />
                <CardSmall
                    articleID={getSlot("right_column", "c2")}
                    article={getArticle("right_column", "c2")}
                    setArticle={(id) => loadArticle("right_column", "c2", id)}
                    removeArticle={() => removeArticle("right_column", "c2")}
                    editMode={editMode}
                />
                <CardSmall
                    articleID={getSlot("right_column", "c3")}
                    article={getArticle("right_column", "c3")}
                    setArticle={(id) => loadArticle("right_column", "c3", id)}
                    removeArticle={() => removeArticle("right_column", "c3")}
                    editMode={editMode}
                />
                <CardSmall
                    articleID={getSlot("right_column", "c4")}
                    article={getArticle("right_column", "c4")}
                    setArticle={(id) => loadArticle("right_column", "c4", id)}
                    removeArticle={() => removeArticle("right_column", "c4")}
                    editMode={editMode}
                />
                <CardSmall
                    articleID={getSlot("right_column", "c5")}
                    article={getArticle("right_column", "c5")}
                    setArticle={(id) => loadArticle("right_column", "c5", id)}
                    removeArticle={() => removeArticle("right_column", "c5")}
                    editMode={editMode}
                />
            </section>
            </div>
            <hr className="hidden lg:block h-[1.5px] w-full border-0 bg-[#DEDEDE] my-6" />
            <div className="hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6">
                <CardMedium
                    articleID={getSlot("middle_grid", "d1")}
                    article={getArticle("middle_grid", "d1")}
                    setArticle={(id) => loadArticle("middle_grid", "d1", id)}
                    removeArticle={() => removeArticle("middle_grid", "d1")}
                    editMode={editMode}
                />
                <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium
                    articleID={getSlot("middle_grid", "d2")}
                    article={getArticle("middle_grid", "d2")}
                    setArticle={(id) => loadArticle("middle_grid", "d2", id)}
                    removeArticle={() => removeArticle("middle_grid", "d2")}
                    editMode={editMode}
                />
                <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium
                    articleID={getSlot("middle_grid", "d3")}
                    article={getArticle("middle_grid", "d3")}
                    setArticle={(id) => loadArticle("middle_grid", "d3", id)}
                    removeArticle={() => removeArticle("middle_grid", "d3")}
                    editMode={editMode}
                />
                <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium
                    articleID={getSlot("middle_grid", "d4")}
                    article={getArticle("middle_grid", "d4")}
                    setArticle={(id) => loadArticle("middle_grid", "d4", id)}
                    removeArticle={() => removeArticle("middle_grid", "d4")}
                    editMode={editMode}
                />
            </div>

            <section className="order-1 h-full divide-y divide-gray-200 bg-white lg:hidden">
                <CardMedium
                    articleID={getSlot("hero", "a1")}
                    article={getArticle("hero", "a1")}
                    setArticle={(id) => loadArticle("hero", "a1", id)}
                    removeArticle={() => removeArticle("hero", "a1")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("left_column", "b1")}
                    article={getArticle("left_column", "b1")}
                    setArticle={(id) => loadArticle("left_column", "b1", id)}
                    removeArticle={() => removeArticle("left_column", "b1")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("left_column", "b2")}
                    article={getArticle("left_column", "b2")}
                    setArticle={(id) => loadArticle("left_column", "b2", id)}
                    removeArticle={() => removeArticle("left_column", "b2")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("right_column", "c1")}
                    article={getArticle("right_column", "c1")}
                    setArticle={(id) => loadArticle("right_column", "c1", id)}
                    removeArticle={() => removeArticle("right_column", "c1")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("right_column", "c2")}
                    article={getArticle("right_column", "c2")}
                    setArticle={(id) => loadArticle("right_column", "c2", id)}
                    removeArticle={() => removeArticle("right_column", "c2")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("right_column", "c3")}
                    article={getArticle("right_column", "c3")}
                    setArticle={(id) => loadArticle("right_column", "c3", id)}
                    removeArticle={() => removeArticle("right_column", "c3")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("right_column", "c4")}
                    article={getArticle("right_column", "c4")}
                    setArticle={(id) => loadArticle("right_column", "c4", id)}
                    removeArticle={() => removeArticle("right_column", "c4")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("right_column", "c5")}
                    article={getArticle("right_column", "c5")}
                    setArticle={(id) => loadArticle("right_column", "c5", id)}
                    removeArticle={() => removeArticle("right_column", "c5")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("middle_grid", "d1")}
                    article={getArticle("middle_grid", "d1")}
                    setArticle={(id) => loadArticle("middle_grid", "d1", id)}
                    removeArticle={() => removeArticle("middle_grid", "d1")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("middle_grid", "d2")}
                    article={getArticle("middle_grid", "d2")}
                    setArticle={(id) => loadArticle("middle_grid", "d2", id)}
                    removeArticle={() => removeArticle("middle_grid", "d2")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("middle_grid", "d3")}
                    article={getArticle("middle_grid", "d3")}
                    setArticle={(id) => loadArticle("middle_grid", "d3", id)}
                    removeArticle={() => removeArticle("middle_grid", "d3")}
                    editMode={editMode}
                />
                <CardMedium
                    articleID={getSlot("middle_grid", "d4")}
                    article={getArticle("middle_grid", "d4")}
                    setArticle={(id) => loadArticle("middle_grid", "d4", id)}
                    removeArticle={() => removeArticle("middle_grid", "d4")}
                    editMode={editMode}
                />
            </section>
        </div>
  );
};

export default Home;

