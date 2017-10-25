import base from './base';
import Page from '../utils/Page';

export default class customerInfo extends base {
  /**
   * 获取客户地址
   * @param customerId
   * @returns {Promise.<TResult>}
   */
  static async addressList(customerId) {
    const url = `${this.baseUrl}/customers/${customerId}/detail_info`;
    return this.get(url).then(data => {
      data.addressList.forEach(v => {
        if (v.sex == '1') {
          v.name += ' 先生';
        } else {
          v.name += ' 女士';
        }
      });

      return data.addressList;
    });
  }

  /**
   * 获取客户详细信息
   */
  static async detailInfo(customerId) {
    const url = `${this.baseUrl}/customers/${customerId}/detail_info `;
    return this.get(url).then(data => {
      let price = data.countCustomerInfo.totalPrice;
      if (price > 1000 * 1000) {
        data.countCustomerInfo.totalPrice = (price / 1000).toFixed(2) + 'k';
      }
      let date = new Date(data.countCustomerInfo.lastOrderTime);
      data.countCustomerInfo.lastOrderTime = this._dealDate(date);

      data.address = this._dealAddres(data.addressList);
      return data;
    });
  }

  /**
   * 处理日期为 MM/DD
   * @param date
   * @returns {string}
   * @private
   */
  static _dealDate(date) {
    let month = date.getMonth();
    let day = date.getDay();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return month + '/' + day;
  }

  /**
   * 过滤地址为isDefault = 1，若无则为第一个
   * @param addressList
   * @returns {*}
   * @private
   */
  static _dealAddres(addressList) {
    if (addressList.length > 0) {
      let address;
      let arr = addressList.filter(v => v.isDefault == '1');
      if (arr.length > 0) {
        address = arr[0];
      } else {
        address = addressList[0];
      }

      return address;
    } else {
      return null;
    }
  }
}
