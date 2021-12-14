import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.manifold import MDS
import matplotlib.pyplot as plt
import japanize_matplotlib

def main():
    
    csv = pd.read_csv("data_mds/song.csv",header=0, index_col=0)  
    csv_len = len(csv)
    
    npdata = np.array(csv.values.flatten())
    A = np.reshape(npdata,(csv_len, csv_len))

    # 与えられた類似度の行列に当てはまる最適な配置を算出
    mds = MDS(n_components=2, dissimilarity="precomputed")
    pos = mds.fit_transform(A)

    # 一列目から曲名を表すラベルの配列を取得
    labels = np.genfromtxt("data_mds/song.csv",delimiter=",",usecols=0,dtype=str)

    plt.scatter(pos[:, 0], pos[:, 1], marker = 'o')

    for label, x, y in zip(labels, pos[:, 0], pos[:, 1]):
        plt.annotate(
            label,
            xy = (x, y), xytext = (40, -20),
            textcoords = 'offset points', ha = 'right', va = 'bottom',
            arrowprops = dict(arrowstyle = '->', connectionstyle = 'arc3,rad=0')
        )

    plt.show()

    fig = plt.figure()
    fig.savefig("img.png")
   
   
if __name__ == "__main__":
    main()