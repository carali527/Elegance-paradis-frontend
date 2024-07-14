import { defineStore } from 'pinia'

import {
  fetchCategories,
  fetchAllProducts,
  fetchProduct
} from '../../api/index'

export const useMemberStore = defineStore('member', {
  state: () => ({
    allCategories: [],
    products: [],
    product: {},
    popupMemberVisible: false,
    cart: 0
  }),
  actions: {
    async fetchCategories() {
      if (this.allCategories.length > 0) {
        return;
      }
      try {
        // const response = await fetchCategories();
        // this.allCategories = response.data;
        this.allCategories = [
          {
            "id": 1,
            "name": "男性香氛",
            "order": 1,
            "imageURL": "https://puls-img.chanel.com/c_limit,w_3200/q_auto:good,dpr_auto,f_auto/1702486160532-oneplpmajorpushdesktop2880x900pxjpg.jpg",
            "description": "男性香氛",
            "subCategory": [
              {
                "id": 3,
                "name": "香水",
                "order": 2,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "男性香水",
                "subCategory": null
              },
              {
                "id": 5,
                "name": "隨身噴香霧",
                "order": 3,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "男性隨身噴香霧",
                "subCategory": null
              },
              {
                "id": 7,
                "name": "沐浴和身體保養",
                "order": 4,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "男性沐浴和身體保養",
                "subCategory": null
              }
            ]
          },
          {
            "id": 2,
            "name": "女性香氛",
            "order": 1,
            "imageURL": "https://puls-img.chanel.com/c_limit,w_3200/q_auto:good,dpr_auto,f_auto/1718096466120-onelandingpagemajorpushdesktop2880x900pxkimjpg_1800x5760.jpg",
            "description": "女性香氛",
            "subCategory": [
              {
                "id": 4,
                "name": "香水",
                "order": 2,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "女性香水",
                "subCategory": null
              },
              {
                "id": 6,
                "name": "隨身噴香霧",
                "order": 3,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "女性隨身噴香霧",
                "subCategory": null
              },
              {
                "id": 8,
                "name": "沐浴和身體保養",
                "order": 4,
                "imageURL": "https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678",
                "description": "女性沐浴和身體保養",
                "subCategory": null
              }
            ]
          }
        ]
      } catch (error) {
        this.error = 'Error fetching categories';
        console.error('Error fetching categories:', error);
      }
    },
    async fetchAllProducts(categoryId) {
      try {
        // const response = await fetchAllProducts(categoryId);
        // this.products = response.data;
        this.product = [
          {
            id: 1,
            name: '香奈兒嘉柏麗香水1',
            description: '香奈兒嘉柏麗隨機噴香霧',
            price: '2,230',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 2,
            name: '香奈兒嘉柏麗香水2',
            description: '香奈兒嘉柏麗流金隨身香水',
            price: '5,700',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 3,
            name: '香奈兒嘉柏麗香水3',
            description: '香奈兒嘉柏麗流金香水',
            price: '4,800',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 3,
            name: '香奈兒嘉柏麗香水3',
            description: '香奈兒嘉柏麗流金香水',
            price: '4,800',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 3,
            name: '香奈兒嘉柏麗香水3',
            description: '香奈兒嘉柏麗流金香水',
            price: '4,800',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 3,
            name: '香奈兒嘉柏麗香水3',
            description: '香奈兒嘉柏麗流金香水',
            price: '4,800',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
          {
            id: 3,
            name: '香奈兒嘉柏麗香水3',
            description: '香奈兒嘉柏麗流金香水',
            price: '4,800',
            image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
            isFaded: false
          },
        ]
      } catch (error) {
        this.error = 'Error fetching categories';
        console.error('Error fetching categories:', error);
      }
    },
    async fetchProduct(categoryId) {
      try {
        // const response = await fetchProduct(categoryId);
        // this.products = response.data;
        this.product = {
          "productId": 3,
          "categoryName": "香水",
          "productName": "清新古龍水",
          "spu": "MF002",
          "description": "這裡是商品詳情的內容",
          "specs": [
            {
              "specId": 1,
              "sku": "MF002_50",
              "unitPrice": 3800,
              "specName": "50ml",
              "specOrder": 4,
              "stockQuantity": 9
            },
            {
              "specId": 2,
              "sku": "MF002_50",
              "unitPrice": 3800,
              "specName": "50ml",
              "specOrder": 4,
              "stockQuantity": 9
            },
            {
              "specId": 3,
              "sku": "MF002_50",
              "unitPrice": 3800,
              "specName": "50ml",
              "specOrder": 4,
              "stockQuantity": 9
            }
          ],
          "productImages": [
            {
              "productImageId": 4,
              "productImageUrl": "https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg",
              "productImageOrder": 1
            },
            {
              "productImageId": 5,
              "productImageUrl": "https://www.chanel.com/images//t_one/t_fnbedito//q_auto:good,f_auto,fl_lossy,dpr_1.1/w_1240/comete-les-exclusifs-de-chanel-eau-de-parfum-spray-6-8fl-oz--packshot-alternative-v1-122560-9539823861790.jpg",
              "productImageOrder": 2
            }
          ]
        }
      } catch (error) {
        this.error = 'Error fetching categories';
        console.error('Error fetching categories:', error);
      }
    },
    isMemberPopupVisible(blooen) {
      this.popupMemberVisible = blooen;
    },
    addToCart(number) {
      this.cart += number;
    },
  }
})
