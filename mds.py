import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.manifold import MDS
import matplotlib.pyplot as plt
import japanize_matplotlib
import json

def main():
    csv = pd.read_csv("data_mds/song.csv",header = 1, index_col = 0)  
    csv_len = len(csv)
    print(str(csv_len) + " array MDS")
    
    npdata = np.array(csv.values.flatten())
    A = np.reshape(npdata,(csv_len, csv_len))

    # 与えられた類似度の行列に当てはまる最適な配置を算出
    mds = MDS(n_components = 2, dissimilarity = "precomputed")
    pos = mds.fit_transform(A)

    # 一列目から曲名を表すラベルの配列を取得
    labels = pd.read_csv("data_mds/song.csv",skiprows=lambda x: x not in [0])
    result = []

    plt.scatter(pos[:, 0], pos[:, 1], marker = 'o')

    for label, x, y in zip(labels, pos[:, 0], pos[:, 1]):
        result.append({"label": label,"data": [{"x":x ,"y":y}]})

    with open('nextjs/src/json/mds.json', 'w') as f:
        json.dump(result, f, ensure_ascii=False)

    plt.show()

   
if __name__ == "__main__":
    main()