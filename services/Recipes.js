
/**
 * Get recipes from JSON API server
 */

import ContentaClient from './ContentaClient'

class Recipes {

  constructor() {
    this.resourceUri = 'recipes'
    this.contenta = new ContentaClient(process.env.contentaJSONAPIBaseUrl)
    this.subrequestsUri = process.env.contentaJSONAPIBaseUrl + '/subrequests?_format=json'
  }

  async findOneById (id) {
    const options = {
      include: 'image,category,image.thumbnail'
    }
    return await this.contenta.get('recipes', options, id)
  }

  async findHomePromotedArticlesAndRecipes () {
    const promotedRecipes = this.contenta.get('recipes', {
      page: { limit: 3 },
      filter: {
        isPromoted: {
          path: 'isPromoted',
          value: 1
        }
      },
      include: 'contentType,image,image.thumbnail',
      fields: {
        recipes: 'contentType,title,difficulty,image',
        images: 'name,thumbnail',
        files: 'filename,url',
        contentTypes: 'type'
      },
      sort: '-created'
    })
    const promotedArticles = this.contenta.get('articles', {
      page: { limit: 3 },
      filter: {
        isPromoted: {
          path: 'isPromoted',
          value: 1
        }
      },
      include: 'contentType,image,image.thumbnail',
      fields: {
        recipes: 'title,difficulty,image',
        images: 'name,thumbnail',
        files: 'filename,url',
        contentTypes: 'type'
      },
      sort: '-created'
    })
    return Promise.all([promotedRecipes, promotedArticles]).then(promisesValues => {
      const data = [...promisesValues[0], ...promisesValues[1]].sort((item1, item2) => item1.createdAt > item2.createdAt).slice(0, 3)
      return data
    })
  }

  /**
   * Promoted recipes sorted by created DESC
   * @param {int} limit 
   */
  async findAllPromoted (limit = 4) {
    const options = {
      page: { limit },
      filter: {
        isPromoted: {
          path: 'isPromoted',
          value: 1
        }
      },
      include: 'image,image.thumbnail',
      fields: {
        recipes: 'title,difficulty,image',
        images: 'name,thumbnail',
        files: 'filename,url'
      },
      sort: '-created'
    }
    return await this.contenta.get('recipes', options)
  }

  async findAllCategories (limit = 20) {
    const options = {
      page: {
        limit
      }
    }
    return await this.contenta.get('categories', options)
  }

  async findAllLatest (limit = 4) {
    const options = {
      sort: '-created',
      page: { limit },
      include: 'image,image.thumbnail',
      fields: {
        recipes: 'title,difficulty,image',
        images: 'name,thumbnail',
        files: 'filename,url'
      }
    }
    return this.contenta.get('recipes', options)
  }

  async findAllByCategoryName (categoryName, limit = 4) {
    const options = {
      sort: '-created',
      include: 'image,image.thumbnail',
      filter: {
        categoryName: {
          condition: {
            path: 'category.name',
            value: categoryName
          }
        },
      },
      fields: {
        recipes: 'title,difficulty,image',
        images: 'name,thumbnail',
        files: 'filename,url'
      },
      page: {
        offset: 0,
        limit: limit,
      }
    }
    return await this.contenta.get(this.resourceUri, options)
  }

}

export default new Recipes()

