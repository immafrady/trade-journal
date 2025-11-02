import dayjs from "dayjs";
import papa from "papaparse";
import * as fs from "node:fs";

const START_DATE = dayjs("2022-01-12");
const TEMPLATE = "YYYY-MM-DD";
const COOKIES = "";

const request = (start, end) => {
  return fetch(
    "https://jywg.18.cn/Search/GetFundsFlow?validatekey=f62cbdf0-9722-4b2c-a5b3-343523cffa2b",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en,zh-CN;q=0.9,zh;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        gw_reqtimestamp: "1761972930789",
        "sec-ch-ua":
          '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: COOKIES,
        Referer: "https://jywg.18.cn/Search/FundsFlow",
      },
      body: `st=${start}&et=${end}&qqhs=10000&dwc=`,
      method: "POST",
    },
  );
};

let endDate = dayjs();
let startDate = endDate.subtract(2, "month");
const map = {};
const tradeType = new Set();
while (endDate.isAfter(START_DATE)) {
  const response = await request(
    startDate.format(TEMPLATE),
    endDate.format(TEMPLATE),
  );
  const { Data = [] } = await response.json();

  Data.forEach((item) => {
    if (
      ["买入", "卖出", "红利入账", "合并"].some((v) => item.Ywsm.includes(v))
    ) {
      const data = {
        交易日期: `${item.Fsrq.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}`,
        成交价格: "",
        交易类型: "",
        份额变化: "",
        金额变化: "",
        费用支出: "",
      };

      const fsje = +item.Fsje;
      const cjje = +item.Cjje;
      const cjjg = item.Cjjg;

      if (item.Ywsm.includes("买入")) {
        data.交易类型 = "买入";
        data.份额变化 = `${item.Cjsl}`;
        data.成交价格 = cjjg;
        data.金额变化 = (-fsje).toFixed(2);
        data.费用支出 = (data.金额变化 - cjje).toFixed(2);
      }
      if (item.Ywsm.includes("卖出")) {
        data.交易类型 = "卖出";
        data.份额变化 = `-${item.Cjsl}`;
        data.成交价格 = cjjg;
        data.金额变化 = (-fsje).toFixed(2);
        data.费用支出 = (cjje - fsje).toFixed(2);
      }
      if (item.Ywsm.includes("红利入账")) {
        data.交易类型 = "分红";
        data.金额变化 = `-${item.Fsje}`;
      }
      if (item.Ywsm.includes("合并")) {
        data.交易类型 = "合股";
        data.份额变化 = `-${item.Cjsl}`;
      }

      tradeType.add(item.Ywsm);
      const label = `${item.Zqdm}-${item.Zqmc}`;
      if (map[label]) {
        map[label].push(data);
      } else {
        map[label] = [data];
      }
    }
  });

  endDate = startDate.subtract(1, "day");
  startDate = endDate.subtract(2, "month");
}

Object.entries(map).forEach(([key, value]) => {
  const csv = papa.unparse(value, {
    header: true, // 输出表头
    newline: "\r\n", // 换行符
  });
  fs.writeFileSync(`${key}.csv`, csv, "utf8");
});
console.log(tradeType);
