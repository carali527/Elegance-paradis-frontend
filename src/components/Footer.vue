<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__section">
        <h4>瀏覽 EleganceParadis</h4>
        <ul>
          <li><a href="#">男性香氛</a></li>
          <li><a href="#">女性香氛</a></li>
        </ul>
      </div>
      <div class="footer__section">
        <h4>線上服務</h4>
        <ul>
          <li><a href="#">我的帳戶</a></li>
          <li><a href="#">常見問題</a></li>
        </ul>
      </div>
      <div class="footer__section">
        <h4>EleganceParadis 品牌</h4>
        <ul>
          <li><a href="#">法律聲明</a></li>
          <li><a href="#">隱私政策</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="location-language">
        <p>台灣地區 - 繁體中文(台灣)</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.footer {
  z-index: 999;
  background: #1d1d1d;
  color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  border-top: solid .5px;
}

.footer__content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer__section {
  flex: 1;
  min-width: 200px;
  margin-bottom: 10px;
  h4 {
    font-size: 1rem;
    margin-bottom: 15px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 10px;
      a {
        color: #ffffff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.footer__bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  border-top: 1px solid #555;
  flex-wrap: wrap;
}

.location-language {
  text-align: center;
  p {
    color: #ffffff;
  }
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: center;
  }
}
</style>
