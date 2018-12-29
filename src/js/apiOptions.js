/*
 * These options work for every twitbook graphql api,
 * only posted body data needs to be different.
 */
module.exports = {
  maanis: {
    credentials: 'include',
    headers: { accept: '*/*', 'accept-language': 'en-US,en;q=0.9', 'content-type': 'application/x-www-form-urlencoded' },
    referrer: 'https://www.facebook.com/',
    referrerPolicy: 'origin-when-cross-origin',
    body: 'av=0&__user=0&__a=1&__dyn=7AzHJ4zamaWxd2umeCExUR1ycCzScBGWAKGgS8WGnJLFGA4XwyxGdwIhEpyAiEKFGV8kGdBCyJz9FGG7oHyaG4V9B88x2axnGiidBAVuVRG4agPxW9xaF-58-EN2-iV8LzoKnGh4-vAZ4gO48nyp8FecHyUV2K8hqwVByFrKm8yFVpV8hyQdzUmDm495UvWUgJ4hUhCCxa4KiRjyFK5evix-Hu4othoScz8KuUC8AyFE-6EB6CyHGmGKunAxpu9iThTGiumqyaA8DpkK25h8izUyiibKbF1l2VpaCULyo4e4e5bU-iZ4GQXp4dyp8BljmeyV8V294dz9eaDCxKQEWqaJ1-l2USh2pumhoN4K4pUVe5UGUmHDAyEOGGhoauGDz8x12V98lzFqKiUyQqQQu4oObz9ohAykZ2XyVUO4kUyh4AFfVbK7pbx6GCyEyu8Cy8GVQqazWgK5FEOjgJ0&__req=3&__be=-1&__pc=PHASED%3ADEFAULT&__rev=4540077&lsd=AVrDdIdZ&fb_api_caller_class=RelayModern&variables=%7B%22pageID%22%3A%22129153634465748%22%7D&doc_id=2343886202319301',
    method: 'POST',
    mode: 'cors',
  },
  hirvis: {
    credentials: 'omit',
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      Authority: 'www.facebook.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      Dnt: '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Safari/537.36 Vivaldi/1.96.1147.64'
    },
    referrer: 'https://www.facebook.com/pg/Maanalainen/events/',
    referrerPolicy: 'origin-when-cross-origin',
    body: 'av=0&__user=0&__a=1&__dyn=7AzHJ4zamaWxd2umeCExUR1ycCzScBypbGAdyeGBXheCGgjK2a6ES2N6xvyAubGqKi5azppEHUOqqGxSaUyGxeipi28gyElWAAzppenKtqx2AcUuyoiGtxifGcgLAKibUSbBWAhfypfh4cx25UCiajzaUKegHy4mEepoGmXBy8Gumui4oJ3o9FRxlu7-K4bh46pFEiGfVbleaCUkVZa7WJUhxR4gScz8KuUC8AyFE-6EB6CyHGmGKunAx6hu9iFktWADBCEyF29Slbwxki2a8AAyXyWglgKmiFKbUC2C6ogUkLzVbQiHjJAgS9AylldoWbAzAdgScAUGuq6XizFEGQ7Vkbzp49BVp5z4iUhDzAUgCyHxqKuiazaGtoK7uGDz8x12V98lCDBGVbybhHjhUhz8KcBx6i9jQbKbVoO4kUyh4AFfWXK7pbx6GCyEyu8Cy8GVQqazWgK5E&__req=b&__be=-1&__pc=PHASED%3ADEFAULT&__rev=4495603&lsd=AVoS6YaX&fb_api_caller_class=RelayModern&variables=%7B%22pageID%22%3A%22202287073132009%22%7D&doc_id=2060893887265467',
    method: 'POST',
    mode: 'cors'
  },
  dogs: {
    credentials: 'include',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/x-www-form-urlencoded'
    },
    referrer: 'https://www.facebook.com/pg/Dogs-Home-262278600483790/events/?ref=page_internal',
    referrerPolicy: 'origin-when-cross-origin',
    body: 'av=0&__user=0&__a=1&__dyn=7AzHJ4zamaWxd2umeCExWyA68OqfoOm9AKGgS8WGnJ4WqF1eU8Eqzob4q6oF4GbGqKi5azppEHoOqqGxSaUyGxeipi28gyElWAAzppenKtqx2AcUK4F98iGvxifGcgLAKibzUKmih4-vAZ4zogxu9AyAUOKbzAaUx5G3Cm4bKm8yFVpV8hyQdzUmDm495UO4KK4bh4u4pFEixbAJkUGrz9-vix6dGTx67kmdz8ObDK9y98GqfxG9hFEGWBBKunAxpu9iThTGiumoWF29SkK25h8iyXy998KUKA5oOmKFKbUC13x3ximfALhaJeSh3oCi9lkRyWyV8V3kdz9eaDCxKQECiq9jgW49kbzp49BUFoN4KmbDzAUnyHxqKuiaz9qAm2DGEky44bAAxmqumHAK8J6Jd7x6cyU998BfgKUKucx5e8Ah9ajKiXxSiUWGGqay9Uyq8gCVQqazWgK5FEOjgEwjihbCAyU&__req=2&__be=0&__pc=PHASED%3ADEFAULT&dpr=1&__rev=4657960&lsd=AVqQvl3q&fb_api_caller_class=RelayModern&variables=%7B%22pageID%22%3A%22262278600483790%22%7D&doc_id=2343886202319301',
    method: 'POST',
    mode: 'cors'
  }
}
