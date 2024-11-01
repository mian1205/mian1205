// 添加标题“Word Cloud”
const wordCloudTitle = document.createElement('div');
wordCloudTitle.id = 'wordCloudTitle';
wordCloudTitle.innerHTML = 'Word Cloud';
document.body.insertBefore(wordCloudTitle, document.getElementById('buttons'));

// HTML 结构
// <div id="wordCloud"></div>
// <div id="movieInfo"></div>
// <div id="buttons"></div>

// 加载外部 JSON 数据
fetch('all_movie_data_clean.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const movieData = data;

    // 初始显示信息
    d3.select("#movieInfo").html(`<p>Click on a movie name to get more information</p>`);

    // 优化 D3 Word Cloud 配置函数
    function drawWordCloud(year) {
      const filteredMovies = movieData.filter(movie => movie.year === year);

      if (filteredMovies.length === 0) {
        d3.select("#wordCloud").selectAll("svg").remove();
        d3.select("#movieInfo").html(`<p>No data available for year ${year}</p>`);
        return;
      }

      const wordEntries = filteredMovies.map(movie => ({
        text: movie.name,
        size: Math.floor(Math.random() * 40) + 7, // 随机字体大小在15到60之间
        audienceScore: movie.audienceScore || 0, // 确保评分有默认值
        story: movie.story,
        marketProfitability: movie.marketProfitability,
        worldwideGross: movie.worldwideGross,
        year: movie.year
      }));

      d3.select("#wordCloud").selectAll("svg").remove(); // 清除旧的word cloud

      const layout = d3.layout.cloud()
        .size([900, 500])
        .words(wordEntries)
        .padding(3)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .spiral('archimedean')
        .on("end", draw)
        .start();

      function draw(words) {
        const svg = d3.select("#wordCloud").append("svg")
          .attr("width", 900)
          .attr("height", 500)
          .append("g")
          .attr("transform", "translate(450,250)");

        svg.selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => d.size + "px")
          .style("fill", d => d3.interpolateRainbow(d.audienceScore / 100)) // 使用颜色渐变设置字体颜色
          .attr("text-anchor", "middle")
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .style("font-family", "'Impact', sans-serif") // 设置字体为 Impact
          .text(d => d.text)
          .on("click", d => {
            // 当点击一个电影时，显示电影的详细信息
            d3.select("#movieInfo").html(`
              <div class="movie-info">
                <h3>${d.text}</h3>
                <p><strong>Year:</strong> ${d.year}</p>
                <p><strong>Audience Score:</strong> ${d.audienceScore}</p>
                <p><strong>Story:</strong> ${d.story}</p>
                <p><strong>Worldwide Gross:</strong> ${d.worldwideGross.toFixed(2)} million</p>
                <p><strong>Market Profitability:</strong> ${d.marketProfitability}</p>
              </div>
            `);
          });
      }
    }

    // 优化按钮创建函数
    function createYearButtons() {
      const years = [2007, 2008, 2009, 2010, 2011];
      const buttonsDiv = d3.select("#buttons");

      buttonsDiv.selectAll("button").remove(); // 清除旧的按钮
      years.forEach(year => {
        buttonsDiv.append("button")
          .text(year)
          .attr("class", "year-button")
          .on("click", function () {
            d3.selectAll(".year-button").classed("active", false);
            d3.select(this).classed("active", true);
            drawWordCloud(year);
          });
      });

      // 默认设置第一个按钮为活跃状态
      buttonsDiv.select("button").classed("active", true);
    }

    // 初始化
    createYearButtons();
    drawWordCloud(2007); // 默认绘制2007年的word cloud
  })
  .catch(error => console.error('Error loading the JSON data:', error));

// 添加 CSS 样式
const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
  
  #buttons {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center; 
  }
  #wordCloudTitle {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    color: black;
    font-family: 'Times New Roman', serif;
  }
  .year-button {
    padding: 10px 14px;
    margin-right: 15px;
    font-size: 18px;
    border: 2px solid #cce5ff; /* 蓝色边框 */
    background-color: #cce5ff; /* 浅蓝色背景 */
    color: #0056b3;
    cursor: pointer;
    border-radius: 8px; /* 圆角按钮 */
    font-family: 'Poppins', sans-serif;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
  .year-button:hover {
    background-color: #99ccff; /* 深一点的蓝色 */
  }
  .year-button.active {
    background-color: #007bff; /* 深蓝色，表示活跃状态 */
    color: white;
    border-color: #007bff;
  }
#wordCloud {
  width: 100%;
  margin: 30px auto; /* 确保水平居中 */
  text-align: center; /* 内容居中 */
  display: flex; /* 使用 flex 布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}
#movieInfo {
  width: 50%;
  margin: 30px auto; /* 使信息框居中 */
  text-align: center; /* 文本居中 */
}
  .movie-info {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    padding: 15px;
    border-radius: 10px;
    background: #fff3f8;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;
document.head.appendChild(style);
