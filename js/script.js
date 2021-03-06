'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorSidebarLink: Handlebars.compile(document.querySelector('#template-author-sidebar-link').innerHTML)
  }

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log(event);
  /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
  /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

 /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
  /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');

  }

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  let html = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  for(let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    html = html + linkHTML;
    }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
 }
generateTitleLinks();

const optArticleTagsSelector = '.post-tags .list';
const optTagsListSelector = '.tags.list';

function calculateTagsParams(tags){
  const params = {max: 0 , min: 999999};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    else if(tags[tag] < params.max){
      params.min = tags[tag];
    }
  }
  return params;
}

const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;

}

function generateTags(){
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      const linkHTMLData = {id: 'tag-' + tag + '', tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
      /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');

  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links HTML code */
  //let allTagsHtml = '';
  const allTagsData = {tags: []};

  /*[NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /*[NEW] generate code of a link and add it to allTagsHtml */
    const tagClass = calculateTagClass(allTags[tag], tagsParams);
    const tagLinkHTML = '<li><a class="'+ tagClass +'" href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
    console.log(tagClass);
    //allTagsHtml += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: tagClass,
      id: 'tag-' + tag
    });
  /* [NEW] END LOOP: for each tag in allTags: */
    }
  /*[NEW] add html from allTagsHtml to tagList */
  //tagList.innerHTML = allTagsHtml;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);

  addClickListenersToTags();

}

generateTags();

function tagClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('tag', tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){
    /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){
    /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags*="' + tag + '"]');

}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for(let link of links){
  /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

const optArticleAuthorSelector = '.post .post-author';
const optAuthorsListSelector = '.author.list';

function generateAuthors(){
  let allAuthors = [];
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  const allAuthorsData = {author: []};

  /* START LOOP: for every article: */
  for(let article of articles){

    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';
      const linkHTMLData = {id: 'author-' + articleAuthor + '', author: articleAuthor};
      const linkHTML = templates.authorLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allAuthors */
      if(allAuthors.indexOf(linkHTML) == -1){
        /* [NEW] add generated code to allAuthors array */
      allAuthors.push(linkHTML);

      allAuthorsData.author.push({
            author: articleAuthor,
            id: 'author-' + articleAuthor
          });
          console.log(allAuthorsData);
      }
    /* insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector('.authors');

  /* [NEW] add html from allAuthors to authorList */
  //authorList.innerHTML = allAuthors.join(' ');
  authorList.innerHTML = templates.authorSidebarLink(allAuthorsData);

  addClickListenersToAuthors();
}

generateAuthors();

function authorClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /*make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  console.log('autor kliknięty', author);
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks){
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found author link */
  for(let authorLink of authorLinks){
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors(){
  /* find all links */
  const links = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for(let link of links){
  /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link */
}



}
