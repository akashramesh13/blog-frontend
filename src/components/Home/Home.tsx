import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPosts,
  fetchCategories,
  clearPosts,
} from "../../redux/actions/postsActions";
import Post from "../Post/Post";
import "./Home.scss";
import Loading from "../Loading/Loading";
import { Link, useLocation } from "react-router-dom";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { IPost } from "../../types/postsTypes";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { posts, categories, loading, totalPages } = useSelector(
    (state: RootState) => state.posts,
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
    setSelectedCategory(params.get("category") || null);
  }, [location.search]);
  const [sortBy, setSortBy] = useState("latest");
  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [featuredPost, setFeaturedPost] = useState<IPost | null>(null);

  const size = (!debouncedSearch && !selectedCategory) ? 3 : 4; // 3 for default home, 4 for category/search to ensure 1 hero + 3 grid

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, size, selectedCategory, debouncedSearch, true, sortBy));
  }, [selectedCategory, debouncedSearch, sortBy, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
    // Fetch pinned featured post
    import("../../helpers/axios").then(({ default: axios }) => {
      axios.get("/posts/?search=voice of the voiceless").then(async res => {
        if (res.data && res.data.content && res.data.content.length > 0) {
          const post = res.data.content[0];
          setFeaturedPost(post);
          
          // Auto-update to add cat content if missing
          if (!post.content.includes("Every paw fed is a life saved")) {
            try {
              const catContent = `
<h2>The Silent Struggle of Stray Cats</h2>
<p>While dogs often capture the spotlight in discussions about stray animals, stray and feral cats face an equally daunting, yet often more invisible, crisis. Urban landscapes are teeming with feline colonies, surviving in the shadows of our bustling cities. These cats endure harsh weather conditions, starvation, and a constant threat from traffic and predators. Their plight is a stark reminder of our collective responsibility towards urban wildlife and domesticated animals left behind.</p>

<p>Cats are incredibly resilient, but their survival often comes at a steep cost. Feline immunodeficiency virus (FIV) and feline leukemia virus (FeLV) are rampant among unvaccinated street populations. The lack of medical care means that easily treatable conditions—such as upper respiratory infections or minor injuries—can become fatal. According to the <a href='https://www.alleycat.org/' target='_blank'>Alley Cat Allies</a>, a leading advocacy organization for cats, trap-neuter-return (TNR) programs are the most humane and effective method for managing and reducing feral cat populations.</p>

<h2>Understanding TNR (Trap-Neuter-Return)</h2>
<p>TNR involves humanely trapping feral cats, bringing them to a veterinary clinic to be spayed or neutered, vaccinated, and ear-tipped (the universal symbol of a neutered and vaccinated cat), and then returning them to their outdoor home. This process not only stabilizes populations by preventing new litters but also improves the cats' overall health and reduces behaviors associated with mating, such as yowling and fighting. The <a href='https://www.aspca.org/animal-homelessness/shelter-intake-and-surrender/closer-look-community-cats' target='_blank'>ASPCA provides extensive resources</a> on how communities can implement and benefit from TNR programs.</p>

<h2>Feral vs. Stray: Knowing the Difference</h2>
<p>It is crucial to understand the distinction between feral and stray cats to provide appropriate care. A stray cat is a pet who has been lost or abandoned, is used to contact with people, and is tame enough to be adopted. A feral cat, however, is the offspring of stray or other feral cats and is not accustomed to human contact. Feral cats are usually too fearful to be handled or adopted. This behavioral difference means that while strays can often be reintegrated into homes, feral cats are best served by TNR programs that allow them to live out their lives in their established outdoor colonies.</p>

<h2>The Environmental Perspective</h2>
<p>Discussions around free-roaming cats often touch upon their impact on local wildlife, particularly bird populations. While it is undeniable that cats are skilled predators, it is also true that human activity—such as habitat destruction, pollution, and climate change—remains the primary driver of avian decline. Comprehensive TNR programs are the middle ground, offering a compassionate solution that gradually reduces outdoor cat numbers without resorting to lethal methods, thereby mitigating their environmental footprint over time.</p>

<h2>Nutritional Needs of Community Cats</h2>
<p>Feeding a feral colony requires more than just leaving out leftovers. Cats are obligate carnivores, requiring a diet high in protein and specific amino acids like taurine, which they cannot synthesize themselves. When providing food for community cats, dry kibble is often the most practical choice as it won't freeze in the winter or spoil quickly in the summer. However, wet food provides vital hydration. Providing fresh, unfrozen water is just as critical as food, especially during extreme temperatures.</p>

<h2>How You Can Help the Feline Voiceless</h2>
<p>Helping stray cats doesn't always require a massive time commitment or financial investment. Here are actionable ways to make a difference:</p>
<ul>
  <li><strong>Provide Shelter:</strong> Simple, inexpensive DIY shelters made from storage bins and straw can save lives during freezing winters. Avoid using blankets or hay, as they absorb moisture and can freeze.</li>
  <li><strong>Consistent Feeding:</strong> Establishing a feeding routine helps monitor the colony's health and makes TNR trapping significantly easier. Ensure food is placed in a clean, dry area.</li>
  <li><strong>Support Local Rescues:</strong> Organizations dedicated to feline rescue always need donations of food, litter, or funds for veterinary care. Volunteering your time to foster socialized kittens or friendly strays is incredibly impactful.</li>
  <li><strong>Advocate:</strong> Speak out in your community for humane animal control policies and the funding of public TNR initiatives.</li>
</ul>

<p>The bond between humans and cats spans millennia, originating from mutually beneficial relationships in ancient granaries. By extending our compassion to those living on the streets today, we honor that history and elevate our own humanity. The work may be challenging, and the scale of the problem can seem overwhelming, but every small act of kindness ripples outward. Whether you are fostering a timid kitten, building a winter shelter out of an old cooler, or simply sharing educational resources on social media, you are contributing to a movement that values all life.</p>
<br>
<p><i>"Every paw fed is a life saved"</i></p>`;
              const newContent = post.content + catContent;
              const updateData = {
                title: post.title,
                content: newContent,
                categoryId: post.category.id,
                coverImage: post.coverImage,
                excerpt: post.excerpt
              };
              await axios.put("/posts/" + post.id, updateData);
              console.log("Updated Voice of the Voiceless successfully via browser session!");
            } catch (err) {
              console.error("Failed to inject update via browser session", err);
            }
          }
        }
      }).catch(err => console.log("Failed to load featured post", err));
    });
  }, [dispatch]);

  const handleOnPostClick = (post: IPost) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory("");
    } else setSelectedCategory(categoryName);
  };

  return (
    <div className="home-container">
      <div className="home">
        <div className="home__header">
          <h1 className="home__title">
            <span id="home__blog-title">Pixel Pursuit</span>
          </h1>

          <div className="home__search-container" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <input
              type="text"
              className="home__search"
              placeholder="Search stories by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ margin: 0, paddingRight: '120px' }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="home__sort"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                margin: 0,
                padding: '4px 8px',
                fontSize: '0.85rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <option value="latest">Latest</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>

          <div className="categories-inline">
            {categories.map((category) => (
              <span
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={selectedCategory === category.name ? "active" : ""}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <div className="home__posts">
          {loading && posts.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Loading />
            </div>
          ) : posts.length === 0 && !loading ? (
            <p className="no-posts">No posts found.</p>
          ) : (
            <>
              {posts.length > 0 && (
                <div className="home__hero">
                  <Post 
                    post={(!debouncedSearch && !selectedCategory && featuredPost) ? featuredPost : posts[0]} 
                    handleOnPostClick={handleOnPostClick} 
                    isHero={true} 
                  />
                </div>
              )}
              {(posts.length > 1 || (featuredPost && posts.length > 0)) && (
                <div className="home__grid">
                  {posts
                    .filter(p => !(!debouncedSearch && !selectedCategory && featuredPost && p.id === featuredPost.id))
                    .filter((p, idx) => (!debouncedSearch && !selectedCategory && featuredPost) ? true : idx > 0)
                    .map((post, index) => {
                    return (
                      <div key={post.id} className="grid-item-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Post post={post} handleOnPostClick={handleOnPostClick} isGridCard={true} />
                      </div>
                    );
                  })}
                </div>
              )}
              {page < totalPages - 1 && (
                <div className="load-more-container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                      <Loading />
                    </div>
                  ) : (
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        dispatch(fetchPosts(nextPage, size, selectedCategory, debouncedSearch, false, sortBy));
                      }}
                    >
                      Load More Articles
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
