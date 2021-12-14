export const backgroundColor = [
  "rgb(254, 202, 87)",
  "rgb(255, 107, 107)",
  "rgb(29, 209, 161)",
  "rgb(16, 172, 132)",
  "rgb(255, 159, 67)",
  "rgb(84, 160, 255)",
  "rgb(248, 165, 194)",
  "rgb(72, 219, 251)",
  "rgb(238, 82, 83)",
  "rgb(255, 250, 101)",
  "rgb(205, 132, 241)",
  "rgb(58, 227, 116)",
  "rgb(153, 102, 255)",
  "rgb(255, 99, 132)",
  "rgb(61, 193, 211)",
  "rgb(106, 137, 204)",
  "rgb(201, 203, 207)",
];

export const barOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const pieOptions = (width: number) => {
  if (width < 480) {
    return {
      plugins: {
        legend: {
          position: "bottom",
          fullSize: false,
          labels: {
            boxHeight: 20,
            boxWidth: 20,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      aspectRatio: 0.5,
    };
  }
  return {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxHeight: 24,
          boxWidth: 24,
        },
      },
    },
  };
};

export const smallPieOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};

export const networkOptions = (width: number) => {
  return {
    width: width > 620 ? "596px" : `${width - 24}px`,
    height: "500px",
    nodes: {
      shape: "circle",
      /*shape: "circularImage",
    image: {
      unselected: "/noimage.png",
    },*/
      size: 30,
      borderWidth: 4,
      scaling: {
        min: 16,
        max: 32,
      },
      font: {
        size: 32,
        color: "#000000",
      },
    },
    edges: {
      arrows: { to: { enabled: false } },
      color: "#000000",
      width: 4,
      length: 120,
    },
    physics: false,
  };
};