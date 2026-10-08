/**
 * SceneBox - Search & Filtering Engine
 * Handles query decomposition, keyword combinations ("funny fight", "emotional ending"),
 * dynamic multi-facet filtering, and sorting without page reloads.
 */

const SearchEngine = {
  activeFilters: {
    query: "",
    category: "All",
    ratingMin: 0,
    duration: "all",
    dnaFocus: "all",
    sortBy: "relevance"
  },

  init() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const cat = params.get("cat");

    if (q) this.activeFilters.query = q;
    if (cat) this.activeFilters.category = cat;

    this.bindInputs();
    this.executeSearch();
  },

  bindInputs() {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const categorySelect = document.getElementById("filter-category");
    const ratingSelect = document.getElementById("filter-rating");
    const durationSelect = document.getElementById("filter-duration");
    const dnaSelect = document.getElementById("filter-dna");
    const sortSelect = document.getElementById("filter-sort");
    const clearBtn = document.getElementById("btn-clear-filters");

    if (searchInput) {
      searchInput.value = this.activeFilters.query;
      searchInput.addEventListener("input", (e) => {
        this.activeFilters.query = e.target.value.trim();
        this.executeSearch();
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = searchInput ? searchInput.value.trim() : "";
        this.activeFilters.query = val;
        if (val) {
          const user = Auth.getCurrentUser();
          StorageManager.logActivity("search", `Searched for '${val}'`, null, user);
        }
        this.executeSearch();
      });
    }

    if (categorySelect) {
      if (this.activeFilters.category !== "All") categorySelect.value = this.activeFilters.category;
      categorySelect.addEventListener("change", (e) => {
        this.activeFilters.category = e.target.value;
        this.executeSearch();
      });
    }

    if (ratingSelect) {
      ratingSelect.addEventListener("change", (e) => {
        this.activeFilters.ratingMin = parseFloat(e.target.value) || 0;
        this.executeSearch();
      });
    }

    if (durationSelect) {
      durationSelect.addEventListener("change", (e) => {
        this.activeFilters.duration = e.target.value;
        this.executeSearch();
      });
    }

    if (dnaSelect) {
      dnaSelect.addEventListener("change", (e) => {
        this.activeFilters.dnaFocus = e.target.value;
        this.executeSearch();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.activeFilters.sortBy = e.target.value;
        this.executeSearch();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearFilters();
      });
    }

    // Keyword chips
    document.querySelectorAll(".quick-keyword-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const keyword = chip.getAttribute("data-term");
        if (searchInput) searchInput.value = keyword;
        this.activeFilters.query = keyword;
        this.executeSearch();
      });
    });
  },

  clearFilters() {
    this.activeFilters = {
      query: "",
      category: "All",
      ratingMin: 0,
      duration: "all",
      dnaFocus: "all",
      sortBy: "relevance"
    };

    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("filter-category");
    const ratingSelect = document.getElementById("filter-rating");
    const durationSelect = document.getElementById("filter-duration");
    const dnaSelect = document.getElementById("filter-dna");
    const sortSelect = document.getElementById("filter-sort");

    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "All";
    if (ratingSelect) ratingSelect.value = "0";
    if (durationSelect) durationSelect.value = "all";
    if (dnaSelect) dnaSelect.value = "all";
    if (sortSelect) sortSelect.value = "relevance";

    this.executeSearch();
    UI.showToast("Filters reset", "info");
  },

  // Smart Query Matcher with keyword combinations
  calculateQueryScore(scene, query) {
    if (!query) return 1;

    const q = query.toLowerCase().trim();
    const qTokens = q.split(/\s+/).filter(Boolean);

    const title = scene.title.toLowerCase();
    const source = scene.source.toLowerCase();
    const category = scene.category.toLowerCase();
    const desc = scene.description.toLowerCase();
    const tags = (scene.tags || []).map(t => t.toLowerCase());

    // 1. Direct exact or substring matches
    if (title.includes(q)) return 100;
    if (tags.some(t => t.includes(q))) return 80;
    if (category.includes(q)) return 70;
    if (source.includes(q)) return 60;
    if (desc.includes(q)) return 40;

    // 2. Smart combinations:
    // "funny fight" -> requires Comedy aspect AND Action/fight aspect
    let score = 0;
    let tokensMatched = 0;

    const keywordMaps = {
      funny: { cat: "comedy", tags: ["comedy", "funny", "laugh", "humor"], dna: "humor" },
      fight: { cat: "action", tags: ["action", "fight", "martial arts", "brawl", "swords"], dna: "action" },
      emotional: { cat: "emotional", tags: ["emotional", "farewell", "heartbreak", "tears", "goodbye"], dna: "emotion" },
      ending: { tags: ["ending", "climax", "farewell", "reveal", "sacrifice"] },
      dialogue: { cat: "iconic dialogue", tags: ["dialogue", "speech", "monologue"] },
      villain: { tags: ["villain", "dark", "evil", "lord", "mastermind", "corrupt"] },
      twist: { cat: "plot twist", tags: ["plot twist", "twist", "reveal", "mystery"] },
      love: { cat: "romance", tags: ["romance", "love", "kiss", "confession"], dna: "romance" },
      space: { tags: ["space", "zero-gravity", "sci-fi", "orbit"] },
      rain: { tags: ["rain", "wet", "downpour", "rooftop"] }
    };

    qTokens.forEach(token => {
      let matchedToken = false;

      // Check token directly in title, tags, category, desc
      if (title.includes(token)) {
        score += 25;
        matchedToken = true;
      }
      if (tags.some(t => t.includes(token))) {
        score += 20;
        matchedToken = true;
      }
      if (category.includes(token)) {
        score += 15;
        matchedToken = true;
      }
      if (desc.includes(token)) {
        score += 10;
        matchedToken = true;
      }

      // Check synonym/concept map
      if (keywordMaps[token]) {
        const mapping = keywordMaps[token];
        if (mapping.cat && category.includes(mapping.cat)) {
          score += 30;
          matchedToken = true;
        }
        if (mapping.tags && mapping.tags.some(t => tags.includes(t))) {
          score += 25;
          matchedToken = true;
        }
        if (mapping.dna && scene.dna && scene.dna[mapping.dna] > 70) {
          score += 20;
          matchedToken = true;
        }
      }

      if (matchedToken) tokensMatched++;
    });

    // Reward matching multiple tokens (combinations like "funny fight")
    if (tokensMatched >= qTokens.length && qTokens.length > 1) {
      score += 50;
    }

    return tokensMatched > 0 ? score : 0;
  },

  executeSearch() {
    const allScenes = StorageManager.getScenes();
    const { query, category, ratingMin, duration, dnaFocus, sortBy } = this.activeFilters;

    // 1. Query & Facet Filter
    let results = allScenes.filter(scene => {
      // Category filter
      if (category !== "All" && scene.category !== category) {
        return false;
      }

      // Rating filter
      if (ratingMin > 0 && scene.rating < ratingMin) {
        return false;
      }

      // Duration filter
      if (duration === "short" && scene.durationSeconds > 180) return false; // < 3 mins
      if (duration === "medium" && (scene.durationSeconds < 180 || scene.durationSeconds > 300)) return false; // 3-5 mins
      if (duration === "long" && scene.durationSeconds < 300) return false; // > 5 mins

      // Scene DNA focus filter (> 75%)
      if (dnaFocus === "intensity" && scene.dna.intensity < 75) return false;
      if (dnaFocus === "emotion" && scene.dna.emotion < 75) return false;
      if (dnaFocus === "humor" && scene.dna.humor < 75) return false;
      if (dnaFocus === "action" && scene.dna.action < 75) return false;
      if (dnaFocus === "romance" && scene.dna.romance < 75) return false;

      // Query filter
      if (query) {
        const score = this.calculateQueryScore(scene, query);
        scene._searchScore = score;
        return score > 0;
      }

      scene._searchScore = 0;
      return true;
    });

    // 2. Sorting
    if (query && sortBy === "relevance") {
      results.sort((a, b) => b._searchScore - a._searchScore);
    } else if (sortBy === "views") {
      results.sort((a, b) => b.views - a.views);
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      results.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
    } else if (sortBy === "likes") {
      results.sort((a, b) => b.likes - a.likes);
    }

    // 3. Render Results
    this.renderResults(results);
  },

  renderResults(results) {
    const countBadge = document.getElementById("search-results-count");
    if (countBadge) {
      countBadge.textContent = `${results.length} scene${results.length === 1 ? '' : 's'} found`;
    }

    const containerId = "search-results-grid";
    if (results.length === 0) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No matching scenes found</h3>
            <p>Try refining your keywords or clearing selected filters.</p>
            <div class="empty-suggestions">
              <span>Suggestions:</span>
              <button class="suggestion-chip" onclick="SearchEngine.searchFor('funny fight')">funny fight</button>
              <button class="suggestion-chip" onclick="SearchEngine.searchFor('emotional ending')">emotional ending</button>
              <button class="suggestion-chip" onclick="SearchEngine.searchFor('best villain dialogue')">best villain dialogue</button>
              <button class="suggestion-chip" onclick="SearchEngine.searchFor('rain')">rain</button>
            </div>
          </div>
        `;
      }
      return;
    }

    Scenes.renderGrid(results, containerId);
  },

  searchFor(term) {
    const input = document.getElementById("search-input");
    if (input) input.value = term;
    this.activeFilters.query = term;
    this.executeSearch();
  }
};
