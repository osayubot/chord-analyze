import requests
from bs4 import BeautifulSoup
import re
import json
import requests
import time
import os

# 複数個ずつファイルに出力するパターン

# 取り出す数
num = 100
# 何回目か
rep = 15 # 次は16から
# 前回からの続き
start = num * (rep-1) + 1


# 引数url,結果出力
def outputChord(url,page_id):

    load_url = url
    html = requests.get(load_url)
    soup = BeautifulSoup(html.content, 'html.parser')
    array_html = soup.prettify().split(';')
    song = ''
    artist = ''
    composer = ''
    chord = []

    for item_html in array_html:
         # 変数名を検索する
         if item_html.find('var ufret_chord_datas =') >= 0:
             # 変数を見つけた
             # 変数名の部分を削除する
             item_html = item_html[35:]
             chord_length = len(item_html)
             # 後ろの'"]'を削除する
             item_html = item_html[:chord_length-1]

             # \\や/を削除する
             item_html = re.sub(r'\\/', '],[', item_html)

             # u266dを♭に変換
             item_html = re.sub(r'\\u266d', '♭', item_html)
             
             # [[を[に変換
             html_formatting = re.sub(r'\[\[', '[', item_html)

             # []で囲まれたコード部分を表示
             pattern = r'\[(.+?)\]'
             chord_array = re.findall(pattern, html_formatting)
 
             chord = chord_array


    for item_html in array_html:
         # 歌名
         if item_html.find('var song_name   = ') >= 0:
             pattern = r'\'(.+?)\''
             song_name = re.findall(pattern, item_html)
             if song_name:
                song = song_name[0]

        # アーティスト名
         if item_html.find('var artist_name = ') >= 0:
            pattern = r'\'(.+?)\''
            artist_name = re.findall(pattern, item_html)
            if artist_name:
                artist = artist_name[0]
        
        # 作曲者名
         if item_html.find('var music') >= 0:
            pattern = r'\'(.+?)\''
            composer_name = re.findall(pattern, item_html)
            composer = composer_name[0]

    print(page_id)

    return { "id" : page_id, "song" : song, "artist" : artist, "composer" : composer, "chord" : chord }

# ディレクトリの名前
dir_name = 'data/chord' + str(num * (rep-1) + 1) + '_' + str(num*rep) + '/json'

for id in range(num):
    # 既にファイルが存在する番号は飛ばす
    if os.path.exists(dir_name + str(id + 1) + '.json') == False:
        load_url = 'https://www.ufret.jp/song.php?data=' + str(id + start)
        output_dict = outputChord(load_url,id + start)
        # スクレイピングの速度を抑える
        time.sleep(1)

        # たまにちゃんとコードを取れていないので取れていない場合もう一度実行
        if len(output_dict["chord"]) == 0:
            output_dict = outputChord(load_url,id + start)

        output_json = json.dumps(output_dict, ensure_ascii=False)
        f = open(dir_name + str(id + 1) + '.json', 'w')
        f.write(output_json)
        f.close()


print('done!')
