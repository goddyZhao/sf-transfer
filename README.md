# sf-transfer
  Combo rule transfer for SuccessFactors project. Transfered fule file is for [Nproxy](http://goddyzhao.me/nproxy/)
  
## Installation

    npm install -g sf-transfer

## Usage
    
    // transfer input.xml to ~/workspace/nproxy-rule.js
    sf -i input.xml -o ~/workspace 

    // transfer a bunch of xml to ~/workspace/nproxy-rule.js
    sf -i xmls/*.xml -o ~/workspace

    // append the transfered result from input.xml to ~/workspace/nproxy-rule.js
    sf -i input.xml -o ~/workspace/nproxy-rule.js --append

    // transfer the xml with specified dir to ~/workspace/nproxy-rule.js
    sf -i input.xml -d your/local/dir -o ~/workspace


### More Options

    Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -i, --input [input]    Specify the sf configuration xml
    -o, --output [output]  Specify the output

## License

sf-transfer is available under the term of MIT License