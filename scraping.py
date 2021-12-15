import requests
from bs4 import BeautifulSoup
import re
import json
import requests
import time
import os

# 複数個ずつファイルに出力するパターン


# サイトからコードを抽出する関数
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
             # 変数名の部分を削除する
             chord_html = item_html[35:]
             chord_length = len(chord_html)
             # 後ろの'"]'を削除する
             chord_html = chord_html[:chord_length-1]
             # \\や/を削除する
             chord_html = re.sub(r'\\/', '],[', chord_html)
             # u266dを♭に変換
             chord_html = re.sub(r'\\u266d', '♭', chord_html)
             # [[を[に変換
             html_formatting = re.sub(r'\[\[', '[', chord_html)
             # []で囲まれたコード部分を表示
             pattern = r'\[(.+?)\]'
             chord_array = re.findall(pattern, html_formatting)                   
             chord = chord_array


         # 歌名
         if item_html.find('var song_name   = ') >= 0:
             song_html = item_html
             pattern = r'\'(.+?)\''
             song_html = song_html.replace("\\'", "’")
             song_name = re.findall(pattern, song_html)
             if song_name:
                song = song_name[0]

        # アーティスト名
         if item_html.find('var artist_name = ') >= 0:
            artist_html = item_html        
            pattern = r'\'(.+?)\''
            artist_html = artist_html.replace("\\'", "’")
            artist_name = re.findall(pattern, artist_html)
            if artist_name:
                artist = artist_name[0]
        
        # 作曲者名
         if item_html.find('var music') >= 0:
            composer_html = item_html
            pattern = r'\'(.+?)\''
            composer = composer_html.replace("\\'", "’")
            composer_name = re.findall(pattern, composer_html)
            if composer_name:
                composer = composer_name[0]

    print(page_id)

    return { "id" : page_id, "song" : song, "artist" : artist, "composer" : composer, "chord" : chord }


def generateJson(offset,rep,dir_name):
    path_name = dir_name + '/json'    
    start = offset * (rep - 1) + 1 # 前回の続きの位置

    for id in range(offset):
        # 既にファイルが存在する番号は飛ばす
        if os.path.exists(path_name + str(id + 1) + '.json') == False and id + start > 98039:
            load_url = 'https://www.ufret.jp/song.php?data=' + str(id + start)
            output_dict = outputChord(load_url,id + start)
            # スクレイピングの速度を抑える
            time.sleep(0.75)

            # バンドスコア・動画プラス・初心者向け簡単コード ver.は除く、保存しない
            if(("初心者向け簡単コード" not in output_dict["song"]) and ("バンドスコア" not in output_dict["song"]) and ("動画プラス" not in output_dict["song"])):
                # たまにちゃんとコードを取れていないので取れていない場合もう一度実行
                if len(output_dict["chord"]) == 0:
                    output_dict = outputChord(load_url,id + start)
                    time.sleep(0.75)

                # コードを取れていた時のみ保存
                if len(output_dict["chord"]) > 0:
                    output_json = json.dumps(output_dict, ensure_ascii=False)
                    f = open(path_name + str(id + 1) + '.json', 'w')
                    f.write(output_json)
                    f.close()



maxRep = 1000 # 何回繰り返すか(maxRep*0ffset曲を取得する)

for rep in range(1,maxRep + 1):
    offset = 100 # JsonFileのかたまり（１ファイルにoffset数を収納）

    dir_name = 'data_raw/chord' + str(offset * (rep - 1) + 1) + '_' + str(offset * rep)

    generateJson(offset,rep,dir_name)

print('done!')
