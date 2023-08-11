document.addEventListener('DOMContentLoaded', async function() {
  // Get the URL from the content script
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, 'getURL', async function(response) {
      if (response) {
        // Extract stock symbol from the URL
        const stockSymbol = response;

        // Make an API request to get news data
        const newsApiKey = '9097ecbcbfmshbd3252b8ada3ee2p139094jsne2bc3d0c3624';
        const newsApiUrl = `https://real-time-finance-data.p.rapidapi.com/stock-news?symbol=${stockSymbol}&language=en`;

        const newsOptions = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': newsApiKey,
            'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com'
          }
        };

        try {
          // Fetch news data from the API
          const newsResponse = await fetch(newsApiUrl, newsOptions);
          const newsData = await newsResponse.json();

          // Extract all news items
          const news = newsData.data.news;

          // Prepare sentiment API requests
          const sentimentApiKey = '9097ecbcbfmshbd3252b8ada3ee2p139094jsne2bc3d0c3624';
          const sentimentApiUrl = 'https://sentiments1.p.rapidapi.com/sentiment';
          const sentimentHeaders = {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': sentimentApiKey,
            'X-RapidAPI-Host': 'sentiments1.p.rapidapi.com'
          };

          // Calculate total sentiment score and count
          let totalSentimentScore = 0;
          let validSentimentCount = 0;


          // Accumulate the news elements
          const newsElements = [];
        
          for (let i = 0; i < news.length; i++) {
            const newsItem = news[i];
            const title = newsItem.article_title;
            const articleUrl = newsItem.article_url;
            const source = newsItem.source;
        
            // Prepare sentiment API request for each title
            const sentimentOptions = {
              method: 'POST',
              headers: sentimentHeaders,
              body: JSON.stringify({ text: title })
            };
        
            try {
              // Fetch sentiment analysis for the title
              const sentimentResponse = await fetch(sentimentApiUrl, sentimentOptions);
              const sentimentResult = await sentimentResponse.json();
              const sentiment = sentimentResult.Sentiment;
              const value = sentimentResult.Value;
        
              // Calculate sentiment score based on sentiment and value
              let sentimentScore;
              if (sentiment === 'positive') {
                sentimentScore = 50 + 50 * value;
              } else if (sentiment === 'negative') {
                sentimentScore = 50 - 50 * value;
              } else {
                sentimentScore = 50;
              }
        
              // Add sentiment score to total if valid sentiment
              if (sentiment === 'positive' || sentiment === 'negative') {
                totalSentimentScore += sentimentScore;
                validSentimentCount++;
              }

              if (i < Math.min(news.length, 5)) {
                // Create a div to hold each news item
                const newsItemDiv = document.createElement('div');
                newsItemDiv.style.margin = '10px';
                newsItemDiv.style.color = sentimentScore > 65 ? 'green' : sentimentScore >= 45 ? 'yellow' : 'red';
          
                // Create an anchor tag for the title
                const titleAnchor = document.createElement('a');
                titleAnchor.href = articleUrl;
                titleAnchor.target = '_blank';
                titleAnchor.textContent = `${title} (${source})`;
                titleAnchor.title = source;
                
                // Create a div for sentiment score
                const sentimentScoreDiv = document.createElement('div');
                sentimentScoreDiv.textContent = `Sentiment Score: ${sentimentScore.toFixed(2)}`;
          
                // Append elements to the news item div
                newsItemDiv.appendChild(titleAnchor);
                newsItemDiv.appendChild(sentimentScoreDiv);
          
                // Append the news item div to the array
                newsElements.push(newsItemDiv);
              }
        
            } catch (error) {
              console.error('Sentiment API Error:', error);
            }
          }
        
          // Append all news item divs to the DOM
          const apiResultElement = document.getElementById('apiResult');
          apiResultElement.innerHTML = ''; // Clear previous content
          newsElements.forEach(newsElement => apiResultElement.appendChild(newsElement));


          // Calculate and display average sentiment score
          if (validSentimentCount > 0) {
            const averageSentimentScore = totalSentimentScore / validSentimentCount;
            const averageSentimentScoreElement = document.createElement('div');
            averageSentimentScoreElement.textContent = `${stockSymbol.toUpperCase()} News Sentiment Score: ${averageSentimentScore.toFixed(2)}`;
          
            // Apply styles based on sentiment score range
            if (averageSentimentScore > 65) {
              averageSentimentScoreElement.style.color = 'green';
            } else if (averageSentimentScore >= 45 && averageSentimentScore <= 65) {
              averageSentimentScoreElement.style.color = 'yellow';
            } else {
              averageSentimentScoreElement.style.color = 'red';
            }
          
            // Make the element bigger
            averageSentimentScoreElement.style.fontSize = '20px';
            averageSentimentScoreElement.style.textDecoration = 'underline'

            averageSentimentScoreElement.style.textAlign = 'center'
            averageSentimentScoreElement.style.marginBottom = '20px'

          
            // Insert the element above the news titles
            apiResultElement.insertBefore(averageSentimentScoreElement, apiResultElement.firstChild);
          } else {
            apiResultElement.textContent = "No valid sentiment data available for calculation.";
          }

        } catch (error) {
          console.error('News API Error:', error);
          document.getElementById('apiResult').textContent = "Error fetching news data from the API.";
        }
      } else {
        document.getElementById('apiResult').textContent = "The current page URL doesn't match the target pattern.";
      }
    });
  });
});